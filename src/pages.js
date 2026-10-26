// Magazine page layouts. Slots: L cover (2x2), M paper, W wide paper, S small paper.
const LAYOUTS = {
  desktop: { slots: ['L', 'M', 'M', 'W', 'S', 'S', 'S', 'S'], mirror: true },
  tablet: { slots: ['L', 'S', 'S', 'S', 'S'], mirror: false },
  mobile: { slots: ['L', 'S', 'S'], mirror: false },
};

export const INKS = ['violet', 'red', 'green', 'blue'];

// Splits items into pages; a short last page keeps the start of the pattern.
// The first page is drawn as specified, every second page after it mirrored.
// Inks start one step later on each page, so consecutive covers never share one
// (with 8 tiles a page, a plain index cycle would make every desktop cover violet).
export function paginate(items, layout) {
  const { slots, mirror } = LAYOUTS[layout];
  const pages = [];
  for (let start = 0; start < items.length; start += slots.length) {
    const n = pages.length;
    pages.push({
      mirrored: mirror && n % 2 === 1,
      tiles: items.slice(start, start + slots.length).map((item, k) => ({
        item,
        slot: slots[k],
        ink: INKS[(n + k) % INKS.length],
      })),
    });
  }
  return pages;
}
