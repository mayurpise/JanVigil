import { directoryData } from '../data/anti_corruption_directory.js';
import { telHref } from './phone.js';
import { INKS, paginate } from './pages.js';
import { searchAgencies } from './search.js';

// Combine States and UTs into a single searchable array
const allAgencies = [
  ...directoryData.states,
  ...directoryData.unionTerritories
];

// Application State
let currentFilter = 'all';
let searchQuery = '';
let currentView = 'grid'; // 'grid' or 'table'
let currentTheme = 'light';
try {
  currentTheme = localStorage.getItem('janvigil_theme') || 'light';
} catch {
  // Storage blocked: keep the default theme
}

// Book state: page elements in reading order (cover first when shown)
let pageEls = [];
let pageIndex = 0;
let flipping = false;
let flipToken = 0;
let queuedTurn = null;

// DOM Element References
const htmlEl = document.documentElement;
const btnThemeToggle = document.getElementById('btn-theme-toggle');
const themeTextEl = document.getElementById('theme-text');

const bookEl = document.getElementById('book');
const gridViewEl = document.getElementById('grid-view');
const coverEl = document.getElementById('issue-cover');
const flipLayerEl = document.getElementById('flip-layer');
const btnPrevPage = document.getElementById('btn-prev-page');
const btnNextPage = document.getElementById('btn-next-page');
const pageIndicatorEl = document.getElementById('page-indicator');

const tableViewEl = document.getElementById('table-view');
const tableBodyEl = document.getElementById('table-body');
const searchInputEl = document.getElementById('search-input');
const searchClearEl = document.getElementById('search-clear');
const noResultsEl = document.getElementById('no-results');
const resultsCountEl = document.getElementById('results-count-text');

const filterBtns = document.querySelectorAll('.filter-btn');
const btnViewGrid = document.getElementById('btn-view-grid');
const btnViewTable = document.getElementById('btn-view-table');

const guideModalEl = document.getElementById('guide-modal');
const btnGuideModal = document.getElementById('btn-guide-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCloseModalFooter = document.getElementById('btn-close-modal-footer');
const guideTabBtns = document.querySelectorAll('.guide-tabs .tab-btn');

const detailModalEl = document.getElementById('detail-modal');
const detailSheetEl = document.getElementById('detail-sheet');
const detailKindEl = document.getElementById('detail-kind');
const detailTitleEl = document.getElementById('detail-title');
const detailSummaryEl = document.getElementById('detail-summary');
const detailBodyEl = document.getElementById('detail-body');
const btnCloseDetail = document.getElementById('btn-close-detail');
const btnCloseDetailFooter = document.getElementById('btn-close-detail-footer');

const btnReadMoreNotice = document.getElementById('btn-read-more-notice');
const btnExportCSV = document.getElementById('btn-export-csv');
const btnResetFilters = document.getElementById('btn-reset-filters');
const toastContainerEl = document.getElementById('toast-container');

// Layout breakpoints, kept in step with style.css
const desktopQuery = window.matchMedia('(min-width: 1024px)');
const tabletQuery = window.matchMedia('(min-width: 640px)');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function currentLayout() {
  if (desktopQuery.matches) return 'desktop';
  return tabletQuery.matches ? 'tablet' : 'mobile';
}

// Apply Theme
function applyTheme(theme) {
  currentTheme = theme;
  htmlEl.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('janvigil_theme', theme);
  } catch {
    // Storage blocked: theme just won't persist
  }
  themeTextEl.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
}

// Update filter badges counts
function updateCounts() {
  document.getElementById('count-all').textContent = allAgencies.length;
  document.getElementById('count-states').textContent = directoryData.states.length;
  document.getElementById('count-uts').textContent = directoryData.unionTerritories.length;

  const verifiedCount = allAgencies.filter(a => a.isFormVerified).length;
  document.getElementById('count-verified').textContent = verifiedCount;

  const anonCount = allAgencies.filter(a => a.anonymousSupport.toLowerCase().includes('yes')).length;
  document.getElementById('count-anon').textContent = anonCount;
}

// Filter and Search Logic
function getFilteredItems() {
  const inFilter = allAgencies.filter(item => {
    if (currentFilter === 'state' && item.type !== 'State') return false;
    if (currentFilter === 'ut' && item.type !== 'Union Territory') return false;
    if (currentFilter === 'verified' && !item.isFormVerified) return false;
    if (currentFilter === 'anonymous' && !item.anonymousSupport.toLowerCase().includes('yes')) return false;
    return true;
  });
  return searchAgencies(inFilter, searchQuery);
}

// Toast helper
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainerEl.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Copy to Clipboard
function copyText(text, label = 'Phone number') {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${label}: ${text}`);
  }).catch(() => {
    showToast(`Failed to copy ${text}`);
  });
}

// External portal link
function createPortalLink(url, text) {
  const link = document.createElement('a');
  link.className = 'url-link';
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = text;
  return link;
}

// Element with an optional class and text, built without innerHTML
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function kindLabel(item) {
  return item.type === 'State' ? 'State' : 'Union territory';
}

// "1076 (via CM Grievance); WhatsApp: 9417891064" -> main "1076 (via CM Grievance)",
// digits "1076", before "", after "(via CM Grievance)", rest "WhatsApp: 9417891064"
function dialParts(phone) {
  const [main, ...rest] = phone.replace(/\*/g, '').split(/\s*[;/]\s*/);
  const digits = (main.match(/\+?\d[\d -]*\d/) || [main])[0];
  const at = main.indexOf(digits);
  return {
    main,
    digits,
    before: main.slice(0, at).trim(),
    after: main.slice(at + digits.length).trim(),
    rest: rest.join('; '),
  };
}

// The digits in number type, the words around them as small body-type notes
function appendDialLine(line, parts, digitsNode) {
  if (parts.before) line.append(el('span', 'card-number-note', parts.before), ' ');
  line.append(digitsNode);
  if (parts.after) line.append(' ', el('span', 'card-number-note', parts.after));
}

// Number block: the dialable digits large, further numbers small (on covers and
// in the sheet), then the unconfirmed marker
function createNumberNode(item, withRest) {
  const parts = dialParts(item.phone);
  const { main, rest } = parts;
  const wrap = el('div', 'card-phone');
  if (telHref(item.phone) === '#') {
    wrap.appendChild(el('p', 'card-number is-text', main));
  } else {
    const line = el('p', 'card-number');
    appendDialLine(line, parts, parts.digits);
    wrap.appendChild(line);
  }
  if (rest && withRest) wrap.appendChild(el('p', 'card-number-rest', rest));
  if (item.phone.includes('*')) wrap.appendChild(el('p', 'marker-unconfirmed', 'Unconfirmed number'));
  return wrap;
}

// Call link, or null when the record has no dialable number
function createCallNode(item, withNumber) {
  const href = telHref(item.phone);
  if (href === '#') return null;
  const number = dialParts(item.phone).digits;
  const link = el('a', 'phone-pill', withNumber ? `Call ${number}` : 'Call');
  link.href = href;
  link.setAttribute('aria-label', `Call ${number}, ${item.name}`);
  return link;
}

function createCopyNode(item) {
  if (telHref(item.phone) === '#') return null;
  const copyBtn = el('button', 'copy-btn btn-line', 'Copy number');
  copyBtn.type = 'button';
  copyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    copyText(item.phone.replace(/\*/g, ''), `${item.name} Helpline`);
  });
  return copyBtn;
}

// Render one tile safely using DOM API
function createCardNode({ item, slot, ink }) {
  const card = el('article', `card card--${slot}`);
  card.dataset.ink = ink;

  const head = el('div', 'card-head');
  if (slot === 'L') head.appendChild(el('p', 'card-kind', kindLabel(item)));
  const title = el('h3', 'card-region-title', slot === 'S' ? undefined : item.name);
  title.tabIndex = -1; // focus target after a page turn
  card.style.setProperty('--len', item.name.length);
  card.style.setProperty('--word', Math.max(...item.name.split(/\s+/).map(word => word.length)));
  head.appendChild(title);

  const openDetail = () => openDetailModal(item, ink);
  // S tiles: the name is the "How to report" button, stretched over the whole tile
  if (slot === 'S') {
    const btnName = el('button', 'btn-detail', item.name);
    btnName.type = 'button';
    btnName.addEventListener('click', openDetail);
    title.appendChild(btnName);
  }

  const foot = el('div', 'card-foot');
  foot.appendChild(createNumberNode(item, slot === 'L'));
  if (slot !== 'S') foot.appendChild(el('p', 'card-agency', item.authority));

  const actions = el('div', 'card-actions');
  const call = createCallNode(item, slot === 'L');
  if (call) actions.appendChild(call);
  if (slot === 'L') {
    const copy = createCopyNode(item);
    if (copy) actions.appendChild(copy);
  }
  if (slot !== 'S') {
    const btnDetail = el('button', 'btn-detail btn-line', 'How to report');
    btnDetail.type = 'button';
    btnDetail.setAttribute('aria-label', `How to report in ${item.name}`);
    btnDetail.addEventListener('click', openDetail);
    actions.appendChild(btnDetail);
  }
  if (actions.children.length) foot.appendChild(actions);

  if (slot === 'L') {
    const links = el('div', 'card-links');
    links.appendChild(createPortalLink(item.url, 'Official portal'));
    if (item.isFormVerified) links.appendChild(el('p', 'card-form', 'Online complaint form'));
    foot.appendChild(links);
  }

  card.appendChild(head);
  card.appendChild(foot);
  return card;
}

function createPageNode(page) {
  const section = el('section', 'page page-agency');
  section.dataset.count = page.tiles.length;
  if (page.mirrored) section.classList.add('is-mirrored');
  page.tiles.forEach(tile => section.appendChild(createCardNode(tile)));
  return section;
}

// Render Table Row Node safely using DOM API
function createTableRowNode(item, index) {
  const tr = document.createElement('tr');
  const cell = (label) => {
    const td = document.createElement('td');
    td.dataset.label = label;
    return td;
  };

  // Region
  const tdRegion = document.createElement('td');
  tdRegion.appendChild(el('strong', null, item.name));
  tdRegion.appendChild(el('span', 'table-kind', kindLabel(item)));

  // Authority
  const tdAuth = cell('Agency');
  tdAuth.textContent = item.authority;

  // Phone
  const tdPhone = cell('Helpline');
  const parts = dialParts(item.phone);
  const href = telHref(item.phone);
  if (href === '#') {
    tdPhone.appendChild(el('span', null, parts.main));
  } else {
    const aPhone = el('a', 'phone-pill', parts.digits);
    aPhone.href = href;
    aPhone.setAttribute('aria-label', `Call ${parts.digits}, ${item.name}`);
    const line = el('span', 'table-number');
    appendDialLine(line, parts, aPhone);
    tdPhone.appendChild(line);
  }
  if (parts.rest) tdPhone.appendChild(el('span', 'table-rest', parts.rest));
  if (item.phone.includes('*')) tdPhone.appendChild(el('span', 'marker-unconfirmed', 'Unconfirmed number'));

  // Anonymous support
  const tdAnon = cell('Anonymous tips');
  tdAnon.textContent = item.anonymousSupport;

  // Escalation
  const tdEsc = cell('If nothing happens');
  tdEsc.textContent = item.escalation;

  // Portal URL
  const tdUrl = cell('Portal');
  const portal = createPortalLink(item.url, '');
  // Domain only, with line-break points after each dot so it never splits inside a word
  const labels = new URL(item.url).hostname.replace(/^www\./, '').split('.');
  labels.forEach((label, i) => {
    portal.append(i < labels.length - 1 ? `${label}.` : label);
    if (i < labels.length - 1) portal.appendChild(document.createElement('wbr'));
  });
  tdUrl.appendChild(portal);

  // Action
  const tdAction = document.createElement('td');
  const btnAction = el('button', 'btn btn-secondary', 'Details');
  btnAction.type = 'button';
  btnAction.setAttribute('aria-label', `How to report in ${item.name}`);
  btnAction.addEventListener('click', () => openDetailModal(item, INKS[index % INKS.length]));
  tdAction.appendChild(btnAction);

  tr.appendChild(tdRegion);
  tr.appendChild(tdAuth);
  tr.appendChild(tdPhone);
  tr.appendChild(tdAnon);
  tr.appendChild(tdEsc);
  tr.appendChild(tdUrl);
  tr.appendChild(tdAction);

  return tr;
}

// ---------- The book ----------

// Show one page; the others stay in the DOM but are inert and hidden
function showPage(index) {
  pageIndex = index;
  pageEls.forEach((page, i) => {
    const current = i === index;
    page.classList.toggle('is-current', current);
    page.inert = !current;
    if (current) page.removeAttribute('aria-hidden');
    else page.setAttribute('aria-hidden', 'true');
  });
  pageIndicatorEl.textContent = `Page ${index + 1} of ${pageEls.length}`;
  btnPrevPage.disabled = index === 0;
  btnNextPage.disabled = index >= pageEls.length - 1;
}

function cancelFlip() {
  flipToken++;
  flipping = false;
  queuedTurn = null;
  flipLayerEl.replaceChildren();
}

function renderBook(items) {
  cancelFlip();
  const withCover = searchQuery.trim() === '' && currentFilter === 'all';
  coverEl.hidden = !withCover;
  coverEl.classList.remove('is-current');
  gridViewEl.querySelectorAll('.page-agency').forEach(page => page.remove());
  const agencyPages = paginate(items, currentLayout()).map(createPageNode);
  agencyPages.forEach(page => gridViewEl.appendChild(page));
  pageEls = withCover ? [coverEl, ...agencyPages] : agencyPages;
  pageEls.forEach((page, i) => page.setAttribute('aria-label', `Page ${i + 1} of ${pageEls.length}`));
  showPage(0);
}

// Visual copy of a page for the flip layers: no ids, not interactive
function pageClone(page) {
  const clone = page.cloneNode(true);
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  clone.classList.add('flip-page');
  return clone;
}

function withShade(face, gradient) {
  const shade = el('div', 'flip-shade');
  shade.style.background = gradient;
  face.appendChild(shade);
  return shade;
}

// Resolve when the animations finish, or after a fallback timeout
function settle(animations, ms) {
  const done = Promise.all(animations.map(a => a.finished)).catch(() => {});
  return Promise.race([done, new Promise(resolve => setTimeout(resolve, ms))]);
}

// Center-hinge fold: the half nearest the turn direction lifts and lands on the other side
function fold(fromPage, toPage, forward) {
  const LEFT = 'inset(0 50% 0 0)';
  const RIGHT = 'inset(0 0 0 50%)';
  const SHADE = 'rgba(18, 12, 30, .5)';

  const under = pageClone(toPage);
  const still = pageClone(fromPage);
  still.style.clipPath = forward ? LEFT : RIGHT;

  const leaf = el('div', 'flip-leaf');
  const front = pageClone(fromPage);
  front.classList.add('flip-face');
  front.style.clipPath = forward ? RIGHT : LEFT;
  const back = pageClone(toPage);
  back.classList.add('flip-face', 'flip-back');
  back.style.clipPath = forward ? LEFT : RIGHT;
  // Darkest at the hinge, fading toward the outer edge
  const frontShade = withShade(front, `linear-gradient(${forward ? 'to right' : 'to left'}, ${SHADE} 50%, transparent 100%)`);
  const backShade = withShade(back, `linear-gradient(${forward ? 'to left' : 'to right'}, ${SHADE} 50%, transparent 100%)`);
  leaf.appendChild(front);
  leaf.appendChild(back);

  flipLayerEl.replaceChildren(under, still, leaf);

  const timing = { duration: 550, easing: 'cubic-bezier(.2, .7, .2, 1)', fill: 'forwards' };
  return settle([
    leaf.animate([{ transform: 'rotateY(0deg)' }, { transform: `rotateY(${forward ? -180 : 180}deg)` }], timing),
    frontShade.animate([{ opacity: 0 }, { opacity: 1, offset: 0.5 }, { opacity: 1 }], timing),
    backShade.animate([{ opacity: 1 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], timing),
  ], 900);
}

function crossfade(toPage) {
  const layer = pageClone(toPage);
  flipLayerEl.replaceChildren(layer);
  return settle([layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: 'forwards' })], 400);
}

async function turnPage(step, moveFocus) {
  const target = pageIndex + step;
  if (target < 0 || target >= pageEls.length) return;
  if (flipping) {
    if (!queuedTurn) queuedTurn = { step, moveFocus };
    return;
  }

  flipping = true;
  const token = flipToken;
  const fromPage = pageEls[pageIndex];
  const toPage = pageEls[target];
  if (reducedMotionQuery.matches) await crossfade(toPage);
  else await fold(fromPage, toPage, step > 0);
  if (token !== flipToken) return; // re-rendered mid-flip

  showPage(target);
  flipLayerEl.replaceChildren();
  flipping = false;
  if (moveFocus) toPage.querySelector('h2, h3')?.focus();

  const next = queuedTurn;
  queuedTurn = null;
  if (next) turnPage(next.step, next.moveFocus);
}

// Render UI based on filtered data
function render() {
  const items = getFilteredItems();

  // Results Count Text
  resultsCountEl.textContent = items.length === allAgencies.length
    ? `Showing all ${items.length} agencies`
    : `Showing ${items.length} of ${allAgencies.length} agencies`;

  const empty = items.length === 0;
  noResultsEl.style.display = empty ? 'grid' : 'none';
  bookEl.style.display = !empty && currentView === 'grid' ? '' : 'none';
  tableViewEl.style.display = !empty && currentView === 'table' ? 'block' : 'none';
  if (empty) {
    cancelFlip();
    pageEls = []; // nothing to turn: page keys fall through to normal scrolling
    return;
  }

  if (currentView === 'grid') {
    renderBook(items);
  } else {
    tableBodyEl.replaceChildren();
    items.forEach((item, i) => {
      tableBodyEl.appendChild(createTableRowNode(item, i));
    });
  }
}

// Modal open/close with focus management
let modalOpener = null;

function openModal(modalEl, closeBtn) {
  modalOpener = document.activeElement;
  modalEl.style.display = 'flex';
  closeBtn.focus();
}

function closeModal(modalEl) {
  modalEl.style.display = 'none';
  if (modalOpener) modalOpener.focus();
}

function isModalOpen() {
  return [guideModalEl, detailModalEl].some(m => m.style.display === 'flex');
}

function sheetSection(heading, ...children) {
  const section = el('section', 'sheet-section');
  section.appendChild(el('h3', null, heading));
  children.forEach(child => section.appendChild(child));
  return section;
}

// Open Detail Modal for specific Region
function openDetailModal(item, ink) {
  detailSheetEl.dataset.ink = ink;
  detailKindEl.textContent = kindLabel(item);
  detailTitleEl.textContent = item.name;
  detailTitleEl.style.setProperty('--len', item.name.length);
  detailTitleEl.style.setProperty('--word', Math.max(...item.name.split(/\s+/).map(word => word.length)));

  // Header band: the number and how to use it
  detailSummaryEl.replaceChildren();
  detailSummaryEl.appendChild(createNumberNode(item, true));
  detailSummaryEl.appendChild(el('p', 'card-agency', item.authority));
  const actions = el('div', 'card-actions');
  const call = createCallNode(item, true);
  if (call) actions.appendChild(call);
  const copy = createCopyNode(item);
  if (copy) actions.appendChild(copy);
  if (actions.children.length) detailSummaryEl.appendChild(actions);

  // How to report
  const types = el('ul', 'type-list');
  item.complaintTypes.forEach(type => types.appendChild(el('li', null, type)));
  const form = item.isFormVerified
    ? el('p', 'form-yes', 'This agency has an online complaint form on its portal.')
    : el('p', null, 'No online complaint form has been confirmed. Call, or use the contact details on the portal.');

  // Anonymous tips
  const anonRule = el('p', 'anon-rule', item.anonymousSupport);
  const anonDetails = el('p', null, item.anonymousDetails);

  // Escalation, as plain text
  const escalation = el('p', null, item.escalation);

  const portal = el('p');
  portal.appendChild(createPortalLink(item.url, item.url.replace(/^https?:\/\//, '').replace(/\/$/, '')));

  detailBodyEl.replaceChildren(
    sheetSection('How to report', el('p', null, 'This agency takes complaints about:'), types, form),
    sheetSection('Anonymous tips', anonRule, anonDetails),
    sheetSection('If nothing happens', escalation),
  );
  if (item.notes) detailBodyEl.appendChild(sheetSection('Notes', el('p', null, item.notes)));
  detailBodyEl.appendChild(sheetSection('Official portal', portal));
  detailBodyEl.scrollTop = 0;

  openModal(detailModalEl, btnCloseDetail);
}

// Export CSV Functionality
function exportCSV() {
  const items = getFilteredItems();
  if (items.length === 0) {
    showToast('No items to export!');
    return;
  }

  const headers = ['Region', 'Type', 'Primary Authority', 'Official Portal URL', 'Helpline', 'Anonymous Support', 'Escalation Path', 'Verified Form'];
  const rows = items.map(i => [
    `"${i.name}"`,
    `"${i.type}"`,
    `"${i.authority.replace(/"/g, '""')}"`,
    `"${i.url}"`,
    `"${i.phone}"`,
    `"${i.anonymousSupport.replace(/"/g, '""')}"`,
    `"${i.escalation.replace(/"/g, '""')}"`,
    `"${i.isFormVerified ? 'Yes' : 'No'}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + '﻿' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `janvigil_in_anti_corruption_directory_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Exported ${items.length} records to CSV`);
}

// Mirror the .active class into aria-pressed
function setPressed(btn, pressed) {
  btn.classList.toggle('active', pressed);
  btn.setAttribute('aria-pressed', pressed);
}

// Clear the search box and query
function clearSearch() {
  searchInputEl.value = '';
  searchQuery = '';
  searchClearEl.hidden = true;
}

function showGuideTab(tabBtn) {
  guideTabBtns.forEach(b => setPressed(b, false));
  setPressed(tabBtn, true);

  const targetId = tabBtn.dataset.tab;
  document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
  document.getElementById(targetId).style.display = 'block';
}

// Event Listeners Setup
function initEvents() {
  // Theme Toggle Listener
  btnThemeToggle.addEventListener('click', () => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  });

  // Search input
  searchInputEl.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    searchClearEl.hidden = searchQuery.trim() === '';
    render();
  });

  searchClearEl.addEventListener('click', () => {
    clearSearch();
    render();
    searchInputEl.focus();
  });

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => setPressed(b, false));
      setPressed(btn, true);
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  // View Switcher
  btnViewGrid.addEventListener('click', () => {
    setPressed(btnViewGrid, true);
    setPressed(btnViewTable, false);
    currentView = 'grid';
    render();
  });

  btnViewTable.addEventListener('click', () => {
    setPressed(btnViewTable, true);
    setPressed(btnViewGrid, false);
    currentView = 'table';
    render();
  });

  // Page turns: buttons, keys, swipe; a new layout re-paginates
  btnPrevPage.addEventListener('click', () => turnPage(-1, true));
  btnNextPage.addEventListener('click', () => turnPage(1, true));

  window.addEventListener('keydown', (e) => {
    if (currentView !== 'grid' || isModalOpen() || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    const step = { ArrowRight: 1, PageDown: 1, ArrowLeft: -1, PageUp: -1 }[e.key];
    if (!step || pageIndex + step < 0 || pageIndex + step >= pageEls.length) return;
    e.preventDefault();
    turnPage(step, true);
  });

  let swipeStart = null;
  gridViewEl.addEventListener('pointerdown', (e) => {
    swipeStart = e.isPrimary && e.pointerType !== 'mouse' ? { x: e.clientX, y: e.clientY } : null;
  });
  gridViewEl.addEventListener('pointercancel', () => { swipeStart = null; });
  gridViewEl.addEventListener('pointerup', (e) => {
    if (!swipeStart) return;
    const dx = e.clientX - swipeStart.x;
    const dy = e.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy)) return;
    turnPage(dx < 0 ? 1 : -1, false);
  });

  desktopQuery.addEventListener('change', render);
  tabletQuery.addEventListener('change', render);

  // Guide Modal
  btnGuideModal.addEventListener('click', () => {
    openModal(guideModalEl, btnCloseModal);
  });

  btnReadMoreNotice.addEventListener('click', () => {
    showGuideTab(guideTabBtns[0]);
    openModal(guideModalEl, btnCloseModal);
  });

  btnCloseModal.addEventListener('click', () => {
    closeModal(guideModalEl);
  });

  btnCloseModalFooter.addEventListener('click', () => {
    closeModal(guideModalEl);
  });

  // Guide Modal Tabs
  guideTabBtns.forEach(tabBtn => {
    tabBtn.addEventListener('click', () => showGuideTab(tabBtn));
  });

  // Detail Modal Close
  btnCloseDetail.addEventListener('click', () => {
    closeModal(detailModalEl);
  });

  btnCloseDetailFooter.addEventListener('click', () => {
    closeModal(detailModalEl);
  });

  // Backdrop click to close modals
  window.addEventListener('click', (e) => {
    if (e.target === guideModalEl) closeModal(guideModalEl);
    if (e.target === detailModalEl) closeModal(detailModalEl);
  });

  // Escape closes whichever modal is open
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    [guideModalEl, detailModalEl].forEach(m => {
      if (m.style.display === 'flex') closeModal(m);
    });
  });

  // Reset filters
  btnResetFilters.addEventListener('click', () => {
    clearSearch();
    currentFilter = 'all';
    filterBtns.forEach(b => setPressed(b, false));
    setPressed(document.querySelector('.filter-btn[data-filter="all"]'), true);
    render();
  });

  // CSV Export
  btnExportCSV.addEventListener('click', exportCSV);
}

// Initialize App
applyTheme(currentTheme);
updateCounts();
initEvents();
render();
