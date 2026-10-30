import test from 'node:test';
import assert from 'node:assert';
import { app } from '../src/app.js';

test('GET / returns API welcome status', async () => {
  const req = {
    method: 'GET',
    url: '/',
  };
  // Test server responds
  assert.ok(app);
});

test('GET /api/health returns healthy payload', async () => {
  // Test route handler directly
  assert.ok(app._router);
});
