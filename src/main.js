import { directoryData } from '../data/anti_corruption_directory.js';
import { telHref } from './phone.js';

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

// DOM Element References
const htmlEl = document.documentElement;
const btnThemeToggle = document.getElementById('btn-theme-toggle');
const themeIconEl = document.getElementById('theme-icon');
const themeTextEl = document.getElementById('theme-text');

const gridViewEl = document.getElementById('grid-view');
const tableViewEl = document.getElementById('table-view');
const tableBodyEl = document.getElementById('table-body');
const searchInputEl = document.getElementById('search-input');
const searchClearEl = document.getElementById('search-clear');
const noResultsEl = document.getElementById('no-results');
const resultsCountEl = document.getElementById('results-count-text');
const activeSearchBadgeEl = document.getElementById('active-search-badge');

const filterBtns = document.querySelectorAll('.filter-btn');
const btnViewGrid = document.getElementById('btn-view-grid');
const btnViewTable = document.getElementById('btn-view-table');

const guideModalEl = document.getElementById('guide-modal');
const btnGuideModal = document.getElementById('btn-guide-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCloseModalFooter = document.getElementById('btn-close-modal-footer');

const detailModalEl = document.getElementById('detail-modal');
const detailTitleEl = document.getElementById('detail-title');
const detailBodyEl = document.getElementById('detail-body');
const btnCloseDetail = document.getElementById('btn-close-detail');
const btnCloseDetailFooter = document.getElementById('btn-close-detail-footer');

const btnReadMoreNotice = document.getElementById('btn-read-more-notice');
const btnExportCSV = document.getElementById('btn-export-csv');
const btnResetFilters = document.getElementById('btn-reset-filters');
const toastContainerEl = document.getElementById('toast-container');

// Apply Theme
function applyTheme(theme) {
  currentTheme = theme;
  htmlEl.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('janvigil_theme', theme);
  } catch {
    // Storage blocked: theme just won't persist
  }
  if (theme === 'dark') {
    themeIconEl.textContent = '☀️';
    themeTextEl.textContent = 'Light Mode';
  } else {
    themeIconEl.textContent = '🌙';
    themeTextEl.textContent = 'Dark Mode';
  }
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
  return allAgencies.filter(item => {
    // 1. Region / Type filter
    if (currentFilter === 'state' && item.type !== 'State') return false;
    if (currentFilter === 'ut' && item.type !== 'Union Territory') return false;
    if (currentFilter === 'verified' && !item.isFormVerified) return false;
    if (currentFilter === 'anonymous' && !item.anonymousSupport.toLowerCase().includes('yes')) return false;

    // 2. Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchAuthority = item.authority.toLowerCase().includes(q);
      const matchPhone = item.phone.toLowerCase().includes(q);
      const matchTypes = item.complaintTypes.some(t => t.toLowerCase().includes(q));
      const matchNotes = (item.notes || '').toLowerCase().includes(q);

      return matchName || matchAuthority || matchPhone || matchTypes || matchNotes;
    }

    return true;
  });
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

// Render Grid Card Element safely using DOM API
function createCardNode(item) {
  const card = document.createElement('div');
  card.className = 'card';

  // Card Header
  const header = document.createElement('div');
  header.className = 'card-header';

  const titleGroup = document.createElement('div');
  const title = document.createElement('h3');
  title.className = 'card-region-title';
  title.textContent = item.name;

  const authority = document.createElement('div');
  authority.className = 'card-authority';
  authority.textContent = item.authority;

  titleGroup.appendChild(title);
  titleGroup.appendChild(authority);

  const typeTag = document.createElement('span');
  typeTag.className = `region-type-tag ${item.type === 'State' ? 'tag-state' : 'tag-ut'}`;
  typeTag.textContent = item.type === 'State' ? 'State' : 'UT';

  header.appendChild(titleGroup);
  header.appendChild(typeTag);

  // Card Body
  const body = document.createElement('div');
  body.className = 'card-body';

  // URL Row
  const urlRow = document.createElement('div');
  urlRow.className = 'info-row';
  const urlLabel = document.createElement('span');
  urlLabel.className = 'info-label';
  urlLabel.textContent = 'Official Complaint Portal';
  
  const urlLink = createPortalLink(item.url, item.url);

  urlRow.appendChild(urlLabel);
  urlRow.appendChild(urlLink);

  // Phone Helpline Row
  const phoneRow = document.createElement('div');
  phoneRow.className = 'info-row';
  const phoneLabel = document.createElement('span');
  phoneLabel.className = 'info-label';
  phoneLabel.textContent = 'Phone / Helpline';

  const phoneWrapper = document.createElement('div');
  phoneWrapper.className = 'phone-wrapper';

  const phonePill = document.createElement('a');
  phonePill.className = 'phone-pill';
  phonePill.href = telHref(item.phone);
  phonePill.textContent = `📞 ${item.phone}`;

  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.textContent = '📋 Copy';
  copyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    copyText(item.phone.replace(/\*/g, ''), `${item.name} Helpline`);
  });

  phoneWrapper.appendChild(phonePill);
  phoneWrapper.appendChild(copyBtn);

  phoneRow.appendChild(phoneLabel);
  phoneRow.appendChild(phoneWrapper);

  // Complaint Types
  const typesRow = document.createElement('div');
  typesRow.className = 'info-row';
  const typesLabel = document.createElement('span');
  typesLabel.className = 'info-label';
  typesLabel.textContent = 'Main Complaint Types';

  const tagsContainer = document.createElement('div');
  tagsContainer.className = 'complaint-tags';
  item.complaintTypes.forEach(tag => {
    const cTag = document.createElement('span');
    cTag.className = 'c-tag';
    cTag.textContent = tag;
    tagsContainer.appendChild(cTag);
  });
  typesRow.appendChild(typesLabel);
  typesRow.appendChild(tagsContainer);

  // Status & Anonymity Pills
  const statusRow = document.createElement('div');
  statusRow.className = 'info-row';

  const statusPill = document.createElement('span');
  statusPill.className = `status-pill ${item.isFormVerified ? 'status-verified' : 'status-unverified'}`;
  statusPill.textContent = item.isFormVerified ? '✓ Verified Direct Portal' : '⚠️ Portal Unverified / General Grievance';

  statusRow.appendChild(statusPill);

  body.appendChild(urlRow);
  body.appendChild(phoneRow);
  body.appendChild(typesRow);
  body.appendChild(statusRow);

  // Card Footer
  const footer = document.createElement('div');
  footer.className = 'card-footer';

  const btnDetail = document.createElement('button');
  btnDetail.className = 'btn-detail';
  btnDetail.textContent = 'View Procedure & Escalation Path →';
  btnDetail.addEventListener('click', () => {
    openDetailModal(item);
  });

  footer.appendChild(btnDetail);

  card.appendChild(header);
  card.appendChild(body);
  card.appendChild(footer);

  return card;
}

// Render Table Row Node safely using DOM API
function createTableRowNode(item) {
  const tr = document.createElement('tr');

  // Region
  const tdRegion = document.createElement('td');
  const regionName = document.createElement('strong');
  regionName.textContent = item.name;
  const tagSpan = document.createElement('span');
  tagSpan.className = `region-type-tag ${item.type === 'State' ? 'tag-state' : 'tag-ut'}`;
  tagSpan.style.marginLeft = '0.5rem';
  tagSpan.textContent = item.type === 'State' ? 'State' : 'UT';

  tdRegion.appendChild(regionName);
  tdRegion.appendChild(tagSpan);

  // Authority
  const tdAuth = document.createElement('td');
  tdAuth.textContent = item.authority;

  // Portal URL
  const tdUrl = document.createElement('td');
  const aUrl = createPortalLink(item.url, item.url);
  tdUrl.appendChild(aUrl);

  // Anonymous support
  const tdAnon = document.createElement('td');
  tdAnon.textContent = item.anonymousSupport;

  // Phone
  const tdPhone = document.createElement('td');
  const aPhone = document.createElement('a');
  aPhone.className = 'phone-pill';
  aPhone.href = telHref(item.phone);
  aPhone.textContent = item.phone;
  tdPhone.appendChild(aPhone);

  // Escalation
  const tdEsc = document.createElement('td');
  tdEsc.textContent = item.escalation;

  // Action
  const tdAction = document.createElement('td');
  const btnAction = document.createElement('button');
  btnAction.className = 'btn btn-outline';
  btnAction.style.padding = '0.3rem 0.6rem';
  btnAction.style.fontSize = '0.78rem';
  btnAction.textContent = 'Details';
  btnAction.addEventListener('click', () => openDetailModal(item));
  tdAction.appendChild(btnAction);

  tr.appendChild(tdRegion);
  tr.appendChild(tdAuth);
  tr.appendChild(tdUrl);
  tr.appendChild(tdAnon);
  tr.appendChild(tdPhone);
  tr.appendChild(tdEsc);
  tr.appendChild(tdAction);

  return tr;
}

// Render UI based on filtered data
function render() {
  const items = getFilteredItems();

  // Results Count Text
  resultsCountEl.replaceChildren();
  const countSpan = document.createElement('span');
  countSpan.innerHTML = `Showing <strong>${items.length}</strong> of ${allAgencies.length} anti-corruption authorities`;
  resultsCountEl.appendChild(countSpan);

  // Search Tag Badge
  if (searchQuery.trim() !== '') {
    activeSearchBadgeEl.style.display = 'inline-block';
    activeSearchBadgeEl.textContent = `Search: "${searchQuery}"`;
  } else {
    activeSearchBadgeEl.style.display = 'none';
  }

  if (items.length === 0) {
    gridViewEl.style.display = 'none';
    tableViewEl.style.display = 'none';
    noResultsEl.style.display = 'block';
    return;
  }

  noResultsEl.style.display = 'none';

  if (currentView === 'grid') {
    gridViewEl.style.display = 'grid';
    tableViewEl.style.display = 'none';

    gridViewEl.replaceChildren();
    items.forEach(item => {
      gridViewEl.appendChild(createCardNode(item));
    });
  } else {
    gridViewEl.style.display = 'none';
    tableViewEl.style.display = 'block';

    tableBodyEl.replaceChildren();
    items.forEach(item => {
      tableBodyEl.appendChild(createTableRowNode(item));
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

// Open Detail Modal for specific Region
function openDetailModal(item) {
  detailTitleEl.textContent = `${item.name} (${item.type})`;
  detailBodyEl.replaceChildren();

  const container = document.createElement('div');
  container.className = 'modal-detail-content';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '1rem';

  // Authority Box
  const authBox = document.createElement('div');
  authBox.className = 'comparison-card';
  const hAuth = document.createElement('h4');
  hAuth.textContent = `Primary Authority: ${item.authority}`;
  const pEsc = document.createElement('p');
  const escLabel = document.createElement('strong');
  escLabel.textContent = 'Escalation Hierarchy:';
  pEsc.appendChild(escLabel);
  pEsc.appendChild(document.createTextNode(` ${item.escalation}`));
  authBox.appendChild(hAuth);
  authBox.appendChild(pEsc);

  // Anonymity Box
  const anonBox = document.createElement('div');
  anonBox.className = 'guide-step-box';
  const anonIcon = document.createElement('div');
  anonIcon.style.fontSize = '1.5rem';
  anonIcon.textContent = '🕵️‍♂️';
  const anonInfo = document.createElement('div');
  const hAnon = document.createElement('h4');
  hAnon.textContent = `Anonymity Rule: ${item.anonymousSupport}`;
  const pAnon = document.createElement('p');
  pAnon.textContent = item.anonymousDetails;
  anonInfo.appendChild(hAnon);
  anonInfo.appendChild(pAnon);
  anonBox.appendChild(anonIcon);
  anonBox.appendChild(anonInfo);

  // Notes & Portal Box
  const notesBox = document.createElement('div');
  notesBox.className = 'flow-step';
  const hNotes = document.createElement('h4');
  hNotes.textContent = 'Official Portal & Operational Notes';
  const pNotes = document.createElement('p');
  pNotes.textContent = item.notes || 'Official government portal handles reports.';
  
  const pUrl = document.createElement('p');
  pUrl.style.marginTop = '0.5rem';
  const aUrl = createPortalLink(item.url, `🔗 Open Official Portal (${item.url})`);
  pUrl.appendChild(aUrl);

  notesBox.appendChild(hNotes);
  notesBox.appendChild(pNotes);
  notesBox.appendChild(pUrl);

  container.appendChild(authBox);
  container.appendChild(anonBox);
  container.appendChild(notesBox);

  detailBodyEl.appendChild(container);
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

  const csvContent = 'data:text/csv;charset=utf-8,' + '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `janvigil_in_anti_corruption_directory_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Exported ${items.length} records to CSV!`);
}

// Clear the search box and query
function clearSearch() {
  searchInputEl.value = '';
  searchQuery = '';
  searchClearEl.style.display = 'none';
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
    if (searchQuery.trim() !== '') {
      searchClearEl.style.display = 'block';
    } else {
      searchClearEl.style.display = 'none';
    }
    render();
  });

  searchClearEl.addEventListener('click', () => {
    clearSearch();
    render();
  });

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  // View Switcher
  btnViewGrid.addEventListener('click', () => {
    btnViewGrid.classList.add('active');
    btnViewTable.classList.remove('active');
    currentView = 'grid';
    render();
  });

  btnViewTable.addEventListener('click', () => {
    btnViewTable.classList.add('active');
    btnViewGrid.classList.remove('active');
    currentView = 'table';
    render();
  });

  // Guide Modal
  btnGuideModal.addEventListener('click', () => {
    openModal(guideModalEl, btnCloseModal);
  });

  btnReadMoreNotice.addEventListener('click', () => {
    openModal(guideModalEl, btnCloseModal);
  });

  btnCloseModal.addEventListener('click', () => {
    closeModal(guideModalEl);
  });

  btnCloseModalFooter.addEventListener('click', () => {
    closeModal(guideModalEl);
  });

  // Guide Modal Tabs
  const guideTabBtns = document.querySelectorAll('.guide-tabs .tab-btn');
  guideTabBtns.forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      guideTabBtns.forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');

      const targetId = tabBtn.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
      document.getElementById(targetId).style.display = 'block';
    });
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
    filterBtns.forEach(b => b.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
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
