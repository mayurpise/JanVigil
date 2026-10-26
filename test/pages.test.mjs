import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paginate } from '../src/pages.js';

const items = Array.from({ length: 36 }, (_, i) => ({ id: `R${i}` }));
const sizes = (pages) => pages.map((page) => page.tiles.length);

test('desktop: 36 items make five pages, the last holding 4', () => {
  assert.deepEqual(sizes(paginate(items, 'desktop')), [8, 8, 8, 8, 4]);
});

test('tablet: 36 items make eight pages, the last holding 1', () => {
  assert.deepEqual(sizes(paginate(items, 'tablet')), [5, 5, 5, 5, 5, 5, 5, 1]);
});

test('mobile: 36 items make twelve pages of 3', () => {
  assert.deepEqual(sizes(paginate(items, 'mobile')), [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
});

test('desktop page slots follow L, M, M, W, S, S, S, S', () => {
  const slots = paginate(items, 'desktop')[0].tiles.map((tile) => tile.slot);
  assert.deepEqual(slots, ['L', 'M', 'M', 'W', 'S', 'S', 'S', 'S']);
});

test('tablet page slots follow L, S, S, S, S', () => {
  const slots = paginate(items, 'tablet')[0].tiles.map((tile) => tile.slot);
  assert.deepEqual(slots, ['L', 'S', 'S', 'S', 'S']);
});

test('mobile page slots follow L, S, S', () => {
  const slots = paginate(items, 'mobile')[0].tiles.map((tile) => tile.slot);
  assert.deepEqual(slots, ['L', 'S', 'S']);
});

test('desktop: item 11 is the W tile of the second page', () => {
  const tile = paginate(items, 'desktop')[1].tiles[3];
  assert.equal(tile.item.id, 'R11');
  assert.equal(tile.slot, 'W');
});

test('desktop: a partial last page keeps the start of the pattern', () => {
  const last = paginate(items, 'desktop')[4];
  assert.deepEqual(last.tiles.map((tile) => tile.item.id), ['R32', 'R33', 'R34', 'R35']);
  assert.deepEqual(last.tiles.map((tile) => tile.slot), ['L', 'M', 'M', 'W']);
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
  const coverInks = paginate(items, 'desktop').map((page) => page.tiles[0].ink);
  assert.deepEqual(coverInks, ['violet', 'red', 'green', 'blue', 'violet']);
});

test('desktop: inks cycle across the tiles of a page from that page cover', () => {
  const inks = paginate(items, 'desktop')[1].tiles.map((tile) => tile.ink);
  assert.deepEqual(inks, ['red', 'green', 'blue', 'violet', 'red', 'green', 'blue', 'violet']);
});

test('mobile: each page cover advances one ink', () => {
  const coverInks = paginate(items, 'mobile').slice(0, 5).map((page) => page.tiles[0].ink);
  assert.deepEqual(coverInks, ['violet', 'red', 'green', 'blue', 'violet']);
});
