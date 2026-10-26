// Magazine page layouts. Each page is a CSS grid: `areas` are its grid-template-areas
// rows, `rows` its row sizes. Area a is the cover tile (L); the others are paper tiles:
// M (medium), W (wide) and S (small). A layout lists one template per tile count, so a
// short last page still fills the page.
const LAYOUTS = {
  desktop: {
    columns: 12,
    mirror: true,
    slots: { a: 'L', b: 'M', c: 'M', d: 'W', e: 'S', f: 'S', g: 'S', h: 'S' },
    templates: {
      8: [['a a a a a a b b b c c c', 'a a a a a a d d d d d d', 'e e e f f f g g g h h h'], ['1fr', '1fr', 'auto']],
      7: [['a a a a a a b b b c c c', 'a a a a a a d d d d d d', 'e e e e f f f f g g g g'], ['1fr', '1fr', 'auto']],
      6: [['a a a a a a b b b c c c', 'a a a a a a d d d d d d', 'e e e e e e f f f f f f'], ['1fr', '1fr', 'auto']],
      5: [['a a a a a a b b b c c c', 'a a a a a a d d d d d d', 'e e e e e e e e e e e e'], ['1fr', '1fr', 'auto']],
      4: [['a a a a a a b b b c c c', 'a a a a a a d d d d d d'], ['1fr', '1fr']],
      3: [['a a a a a a b b b b b b', 'a a a a a a c c c c c c'], ['1fr', '1fr']],
      2: [['a a a a a a b b b b b b'], ['1fr']],
      1: [['a a a a a a a a a a a a'], ['1fr']],
    },
  },
  // Desktop screens too short for three rows of tiles
  desktopShort: {
    columns: 12,
    mirror: true,
    slots: { a: 'L', b: 'M', c: 'M', d: 'S', e: 'S', f: 'S' },
    templates: {
      6: [['a a a a a a b b b c c c', 'a a a a a a d d e e f f'], ['1fr', '1fr']],
      5: [['a a a a a a b b b c c c', 'a a a a a a d d d e e e'], ['1fr', '1fr']],
      4: [['a a a a a a b b b c c c', 'a a a a a a d d d d d d'], ['1fr', '1fr']],
      3: [['a a a a a a b b b b b b', 'a a a a a a c c c c c c'], ['1fr', '1fr']],
      2: [['a a a a a a b b b b b b'], ['1fr']],
      1: [['a a a a a a a a a a a a'], ['1fr']],
    },
  },
  tablet: {
    columns: 2,
    mirror: false,
    slots: { a: 'L', b: 'S', c: 'S', d: 'S', e: 'S' },
    templates: {
      5: [['a a', 'b c', 'd e'], ['1fr', 'auto', 'auto']],
      4: [['a a', 'b c', 'd d'], ['1fr', 'auto', 'auto']],
      3: [['a a', 'b c'], ['1fr', 'auto']],
      2: [['a a', 'b b'], ['1fr', 'auto']],
      1: [['a a'], ['1fr']],
    },
  },
  mobile: {
    columns: 2,
    mirror: false,
    slots: { a: 'L', b: 'S', c: 'S' },
    templates: {
      3: [['a a', 'b c'], ['1fr', 'auto']],
      2: [['a a', 'b b'], ['1fr', 'auto']],
      1: [['a a'], ['1fr']],
    },
  },
};

export const INKS = ['violet', 'red', 'green', 'blue'];
const AREA_ORDER = 'abcdefgh';

// Mirroring moves the cover's columns to the right end of each row it spans
function mirrorRow(row) {
  const cells = row.split(' ');
  const cover = cells.filter((cell) => cell === 'a');
  return [...cells.filter((cell) => cell !== 'a'), ...cover].join(' ');
}

// Splits items into pages. The first page is drawn as specified, every second page
// after it mirrored. Items fill areas in reading order (rows top to bottom, cells
// left to right), so on a mirrored page the cover holds the third item and DOM order,
// visual order and alphabetical order agree. Inks start one step later on each page,
// so consecutive covers never share one.
export function paginate(items, layout) {
  const { columns, mirror, slots, templates } = LAYOUTS[layout];
  const size = Object.keys(slots).length;
  const pages = [];
  for (let start = 0; start < items.length; start += size) {
    const n = pages.length;
    const pageItems = items.slice(start, start + size);
    const mirrored = mirror && n % 2 === 1;
    const [base, rows] = templates[pageItems.length];
    const areas = mirrored ? base.map(mirrorRow) : base;
    const order = [...new Set(areas.join(' ').split(' '))];
    pages.push({
      mirrored,
      columns,
      rows,
      areas,
      tiles: pageItems.map((item, k) => ({
        item,
        slot: slots[order[k]],
        area: order[k],
        ink: INKS[(n + AREA_ORDER.indexOf(order[k])) % INKS.length],
      })),
    });
  }
  return pages;
}
