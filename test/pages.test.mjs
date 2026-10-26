import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paginate } from '../src/pages.js';

const list = (n) => Array.from({ length: n }, (_, i) => ({ id: `R${i}` }));
const items = list(36);
const sizes = (pages) => pages.map((page) => page.tiles.length);
const slots = (page) => page.tiles.map((tile) => tile.slot);
const cover = (page) => page.tiles.find((tile) => tile.slot === 'L');

test('desktop: 36 items make five pages, the last holding 4', () => {
  assert.deepEqual(sizes(paginate(items, 'desktop')), [8, 8, 8, 8, 4]);
});

test('short desktop: 36 items make six pages of 6', () => {
  assert.deepEqual(sizes(paginate(items, 'desktopShort')), [6, 6, 6, 6, 6, 6]);
});

test('tablet: 36 items make eight pages, the last holding 1', () => {
  assert.deepEqual(sizes(paginate(items, 'tablet')), [5, 5, 5, 5, 5, 5, 5, 1]);
});

test('mobile: 36 items make twelve pages of 3', () => {
  assert.deepEqual(sizes(paginate(items, 'mobile')), [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
});

test('desktop page slots follow L, M, M, W, S, S, S, S', () => {
  assert.deepEqual(slots(paginate(items, 'desktop')[0]), ['L', 'M', 'M', 'W', 'S', 'S', 'S', 'S']);
});

test('short desktop page slots follow L, M, M, S, S, S', () => {
  assert.deepEqual(slots(paginate(items, 'desktopShort')[0]), ['L', 'M', 'M', 'S', 'S', 'S']);
});

test('tablet page slots follow L, S, S, S, S', () => {
  assert.deepEqual(slots(paginate(items, 'tablet')[0]), ['L', 'S', 'S', 'S', 'S']);
});

test('mobile page slots follow L, S, S', () => {
  assert.deepEqual(slots(paginate(items, 'mobile')[0]), ['L', 'S', 'S']);
});

test('desktop page template: cover top left over two rows, small tiles in an auto row', () => {
  const page = paginate(items, 'desktop')[0];
  assert.equal(page.columns, 12);
  assert.deepEqual(page.areas, ['a a a a a a b b b c c c', 'a a a a a a d d d d d d', 'e e e f f f g g g h h h']);
  assert.deepEqual(page.rows, ['1fr', '1fr', 'auto']);
  assert.deepEqual(page.tiles.map((tile) => tile.area), ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
});

test('desktop mirrored page: cover on the right, tiles in reading order with the cover third', () => {
  const page = paginate(items, 'desktop')[1];
  assert.deepEqual(page.areas, ['b b b c c c a a a a a a', 'd d d d d d a a a a a a', 'e e e f f f g g g h h h']);
  assert.deepEqual(page.tiles.map((tile) => tile.item.id), ['R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15']);
  assert.deepEqual(slots(page), ['M', 'M', 'L', 'W', 'S', 'S', 'S', 'S']);
  assert.deepEqual(page.tiles.map((tile) => tile.area), ['b', 'c', 'a', 'd', 'e', 'f', 'g', 'h']);
});

test('short desktop: two rows, mirrored on the second page', () => {
  const [first, second] = paginate(items, 'desktopShort');
  assert.deepEqual(first.areas, ['a a a a a a b b b c c c', 'a a a a a a d d e e f f']);
  assert.deepEqual(first.rows, ['1fr', '1fr']);
  assert.deepEqual(second.areas, ['b b b c c c a a a a a a', 'd d e e f f a a a a a a']);
  assert.deepEqual(slots(second), ['M', 'M', 'L', 'S', 'S', 'S']);
});

test('desktop: item 11 is the W tile of the second page', () => {
  const tile = paginate(items, 'desktop')[1].tiles[3];
  assert.equal(tile.item.id, 'R11');
  assert.equal(tile.slot, 'W');
});

test('desktop: a partial last page keeps the start of the pattern', () => {
  const last = paginate(items, 'desktop')[4];
  assert.deepEqual(last.tiles.map((tile) => tile.item.id), ['R32', 'R33', 'R34', 'R35']);
  assert.deepEqual(slots(last), ['L', 'M', 'M', 'W']);
  assert.deepEqual(last.areas, ['a a a a a a b b b c c c', 'a a a a a a d d d d d d']);
  assert.deepEqual(last.rows, ['1fr', '1fr']);
});

test('desktop: a mirrored partial page of 4 reads M, M, cover, W', () => {
  const page = paginate(list(12), 'desktop')[1];
  assert.deepEqual(slots(page), ['M', 'M', 'L', 'W']);
  assert.deepEqual(page.areas, ['b b b c c c a a a a a a', 'd d d d d d a a a a a a']);
});

test('desktop: a mirrored partial page of 3 reads M, cover, M', () => {
  const page = paginate(list(11), 'desktop')[1];
  assert.deepEqual(slots(page), ['M', 'L', 'M']);
  assert.deepEqual(page.tiles.map((tile) => tile.area), ['b', 'a', 'c']);
});

test('tablet and mobile page templates', () => {
  assert.deepEqual(paginate(items, 'tablet')[0].areas, ['a a', 'b c', 'd e']);
  assert.deepEqual(paginate(items, 'tablet')[0].rows, ['1fr', 'auto', 'auto']);
  assert.deepEqual(paginate(items, 'mobile')[0].areas, ['a a', 'b c']);
  assert.deepEqual(paginate(items, 'mobile')[0].rows, ['1fr', 'auto']);
});

test('no items make no pages', () => {
  assert.deepEqual(paginate([], 'desktop'), []);
});

test('desktop mirrors every second page', () => {
  assert.deepEqual(paginate(items, 'desktop').map((page) => page.mirrored), [false, true, false, true, false]);
});

test('tablet and mobile pages are never mirrored', () => {
  const mirrored = [...paginate(items, 'tablet'), ...paginate(items, 'mobile')].filter((page) => page.mirrored);
  assert.deepEqual(mirrored, []);
});

test('desktop: each page cover advances one ink, violet, red, green, blue', () => {
  const coverInks = paginate(items, 'desktop').map((page) => cover(page).ink);
  assert.deepEqual(coverInks, ['violet', 'red', 'green', 'blue', 'violet']);
});

test('desktop: inks follow the areas of a page, starting from that page cover', () => {
  const inks = paginate(items, 'desktop')[1].tiles.map((tile) => tile.ink);
  assert.deepEqual(inks, ['green', 'blue', 'red', 'violet', 'red', 'green', 'blue', 'violet']);
});

test('mobile: each page cover advances one ink', () => {
  const coverInks = paginate(items, 'mobile').slice(0, 5).map((page) => cover(page).ink);
  assert.deepEqual(coverInks, ['violet', 'red', 'green', 'blue', 'violet']);
});
