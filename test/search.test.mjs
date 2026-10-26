import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALIASES, searchAgencies } from '../src/search.js';
import { directoryData } from '../data/anti_corruption_directory.js';

const records = [...directoryData.states, ...directoryData.unionTerritories];
const ids = (query) => searchAgencies(records, query).map((record) => record.id);

const finds = [
  ['jammu and kashmir', ['JK']],
  ['j&k', ['JK']],
  ['andaman and nicobar', ['AN']],
  ['dadra and nagar haveli', ['DN']],
  ['orissa', ['OR']],
  ['pondicherry', ['PY']],
  ['uttaranchal', ['UK']],
  ['tn', ['TN']],
  ['up', ['UP']],
  ['new delhi', ['DL']],
  ['nct', ['DL']],
  ['dnh', ['DN']],
  ['a&n', ['AN']],
  ['chattisgarh', ['CG']],
  ['Tamil-Nadu', ['TN']],
  ['DELHI', ['DL']],
];

for (const [query, expected] of finds) {
  test(`search "${query}" finds ${expected.join(', ')}`, () => {
    assert.deepEqual(ids(query), expected);
  });
}

test('a number still matches by phone', () => {
  assert.deepEqual(ids('1064'), ['BR', 'CG', 'GJ', 'HR', 'HP', 'JH', 'KL', 'MH', 'NL', 'RJ', 'TN', 'TG', 'TR', 'UK', 'DN']);
});

test('an authority word still matches by authority', () => {
  assert.deepEqual(ids('lokayukta'), ['KA', 'MP', 'ML', 'MZ', 'TR']);
});

test('a short query matches only the start of a name, not words inside other fields', () => {
  assert.deepEqual(ids('goa'), ['GA']);
});

test('an empty query returns every record in order', () => {
  assert.deepEqual(ids('  '), records.map((record) => record.id));
});

test('name and alias matches come before matches in other fields', () => {
  const items = [
    { id: 'X1', name: 'Alpha', authority: 'Beta Bureau', phone: '', complaintTypes: [], notes: '' },
    { id: 'X2', name: 'Beta', authority: 'Bureau', phone: '', complaintTypes: [], notes: '' },
  ];
  assert.deepEqual(searchAgencies(items, 'beta').map((item) => item.id), ['X2', 'X1']);
});

test('every alias belongs to a real record id', () => {
  const known = new Set(records.map((record) => record.id));
  assert.deepEqual(Object.keys(ALIASES).filter((id) => !known.has(id)), []);
});
