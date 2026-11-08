import test from 'node:test';
import assert from 'node:assert/strict';
import { findDuplicates, haversineMeters, tokenize, jaccard } from './utils/similarity.js';

const now = new Date('2026-11-08T10:00:00Z');
const base = { category: 'pothole', status: 'open', area: 'MG Road', createdAt: '2026-11-06T10:00:00Z' };
const existing = [
  { ...base, _id: 1, title: 'Large pothole near bus stop', description: 'Deep pothole damaging vehicles', lat: 12.9716, lng: 77.5946 },
  { ...base, _id: 2, title: 'Pothole far away', description: 'Pothole on another road', lat: 12.9900, lng: 77.6200 },
  { ...base, _id: 3, title: 'Large pothole near bus stop', description: 'Deep pothole', lat: 12.9716, lng: 77.5946, status: 'resolved' },
  { ...base, _id: 4, title: 'Overflowing bin', description: 'Garbage everywhere', lat: 12.9716, lng: 77.5946, category: 'garbage' },
];

test('haversine ~111m per 0.001 deg latitude', () => {
  const d = haversineMeters(12.0, 77.0, 12.001, 77.0);
  assert.ok(d > 108 && d < 114);
});
test('tokenizer stems plurals and drops stop words', () => {
  assert.deepEqual([...tokenize('The potholes are leaking')].sort(), ['leak', 'pothol']);
  assert.equal(jaccard(new Set(), new Set(['a'])), 0);
});
test('close, similar report is a likely duplicate', () => {
  const draft = { category: 'pothole', title: 'Big pothole at the bus stop', description: 'Deep pothole hurting vehicles', lat: 12.9717, lng: 77.5947, area: 'mg road' };
  const r = findDuplicates(draft, existing, now);
  assert.equal(r.length, 1);
  assert.equal(r[0].issue._id, 1);
  assert.ok(r[0].likely);
});
test('resolved, other-category and far issues are ignored', () => {
  const draft = { category: 'pothole', title: 'Pothole', description: 'pothole', lat: 12.9716, lng: 77.5946, area: 'MG Road' };
  const ids = findDuplicates(draft, existing, now).map((m) => m.issue._id);
  assert.ok(!ids.includes(2) && !ids.includes(3) && !ids.includes(4));
});
