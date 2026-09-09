import test from 'node:test';
import assert from 'node:assert/strict';
import { formatProjectPeriod } from '../lib/project-period.mjs';

test('shows one month when start and end are in the same month', () => {
  assert.equal(formatProjectPeriod('2026-01-01', '2026-01-31'), '2026.01');
});

test('shows a month range when start and end differ', () => {
  assert.equal(
    formatProjectPeriod('2025-11-01', '2026-01-31'),
    '2025.11 — 2026.01',
  );
});

test('shows the start month when there is no end date', () => {
  assert.equal(formatProjectPeriod('2026-03-01'), '2026.03');
});

test('keeps legacy month values working during migration', () => {
  assert.equal(formatProjectPeriod(undefined, undefined, '2025.12'), '2025.12');
});
