import { test } from 'node:test';
import assert from 'node:assert/strict';
import { telHref } from '../src/phone.js';
import { directoryData } from '../data/anti_corruption_directory.js';

const cases = [
  ['Haryana: number then WhatsApp', '1800-180-2022; WhatsApp: 9417891064', 'tel:18001802022'],
  ['Kerala: number then WhatsApp', '1064; WhatsApp: 9447789100', 'tel:1064'],
  ['Chandigarh: three numbers', '0172-2743410; PS: 0172-2740012; Helpline: 8360817378', 'tel:01722743410'],
  ['Puducherry: slash-separated', '1031 / 0413-2231444*', 'tel:1031'],
  ['unverified marker', '1064*', 'tel:1064'],
  ['single number', '14400', 'tel:14400'],
  ['text without digits (Meghalaya)', 'Official contact on portal', '#'],
  ['text without digits (Ladakh)', 'Through UT Administration', '#'],
];

for (const [name, phone, expected] of cases) {
  test(`telHref: ${name}`, () => {
    assert.equal(telHref(phone), expected);
  });
}

test('telHref: every record in the data file is # or a short tel: number', () => {
  const records = [...directoryData.states, ...directoryData.unionTerritories];
  for (const r of records) {
    const href = telHref(r.phone);
    assert.ok(href === '#' || /^tel:\+?\d{3,13}$/.test(href), `${r.name}: ${r.phone} -> ${href}`);
  }
});
