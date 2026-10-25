import { test } from 'node:test';
import assert from 'node:assert/strict';
import { directoryData } from '../data/anti_corruption_directory.js';

const REQUIRED_FIELDS = [
  'id',
  'name',
  'type',
  'authority',
  'url',
  'complaintTypes',
  'anonymousSupport',
  'anonymousDetails',
  'phone',
  'escalation',
  'isFormVerified',
  'notes',
];

const records = [...directoryData.states, ...directoryData.unionTerritories];

test('every state and union territory record has all required fields', () => {
  const missing = records.flatMap((record) =>
    REQUIRED_FIELDS.filter((field) => !(field in record)).map((field) => `${record.id}.${field}`),
  );
  assert.deepEqual(missing, []);
});

test('id values are unique across states and union territories', () => {
  const ids = records.map((record) => record.id);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual(duplicates, []);
});
