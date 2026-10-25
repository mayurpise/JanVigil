// Magazine page layouts. Slots: L cover (2x2), M paper, W wide paper, S small paper.
const LAYOUTS = {
  desktop: { slots: ['L', 'M', 'M', 'W', 'S', 'S', 'S', 'S'], mirror: true },
  tablet: { slots: ['L', 'S', 'S', 'S', 'S'], mirror: false },
  mobile: { slots: ['L', 'S', 'S'], mirror: false },
};

export const INKS = ['violet', 'red', 'green', 'blue'];

// Splits items into pages; a short last page keeps the start of the pattern.
// The first page is drawn as specified, every second page after it mirrored.
export function paginate(items, layout) {
  const { slots, mirror } = LAYOUTS[layout];
  const pages = [];
  for (let start = 0; start < items.length; start += slots.length) {
    pages.push({
      mirrored: mirror && pages.length % 2 === 1,
      tiles: items.slice(start, start + slots.length).map((item, k) => ({
        item,
        slot: slots[k],
        ink: INKS[(start + k) % INKS.length],
      })),
    });
  }
  return pages;
}
