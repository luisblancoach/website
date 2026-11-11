import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GET } from './route';

test('catalog consumer follows pages and projects only gallery fields', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return Response.json({ docs: [{ id: `tool-${calls}`, title: 'Tool', description: 'Description', category: 'tools', href: 'https://portal.raidguild.org/modules/tool', image: null, privateField: 'not forwarded' }], nextPage: calls === 1 ? 2 : null });
  };
  try {
    const response = await GET();
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.docs.length, 2);
    assert.equal(body.docs[0].image, null);
    assert.equal('privateField' in body.docs[0], false);
  } finally { globalThis.fetch = original; }
});

test('empty catalog stays empty and upstream errors are not cached', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => Response.json({ docs: [], nextPage: null });
    assert.deepEqual(await (await GET()).json(), { docs: [] });
    globalThis.fetch = async () => new Response(null, { status: 403 });
    const response = await GET();
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  } finally { globalThis.fetch = original; }
});

test('unsafe links fail closed', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ docs: [{ id: 'tool', title: 'Tool', description: 'Description', category: 'tools', href: 'javascript:alert(1)' }], nextPage: null });
  try { assert.equal((await GET()).status, 503); }
  finally { globalThis.fetch = original; }
});

test('catalog accepts five pages and 500 cards', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return Response.json({
      docs: Array.from({ length: 100 }, (_, index) => ({ id: `tool-${calls}-${index}`, title: 'Tool', description: 'Description', category: 'tools', href: 'https://portal.raidguild.org/modules/tool' })),
      nextPage: calls < 5 ? calls + 1 : null,
    });
  };
  try {
    const response = await GET();
    assert.equal(response.status, 200);
    assert.equal((await response.json()).docs.length, 500);
    assert.equal(calls, 5);
  } finally { globalThis.fetch = original; }
});

test('catalog refuses a sixth page without fetching it', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return Response.json({ docs: [], nextPage: calls + 1 });
  };
  try {
    const response = await GET();
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(calls, 5);
  } finally { globalThis.fetch = original; }
});

test('catalog refuses more than 500 cards without returning partial data', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => Response.json({
    docs: Array.from({ length: 501 }, (_, index) => ({ id: `tool-${index}`, title: 'Tool', description: 'Description', category: 'tools', href: 'https://portal.raidguild.org/modules/tool' })),
    nextPage: null,
  });
  try {
    const response = await GET();
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  } finally { globalThis.fetch = original; }
});

test('catalog shares a single abort signal across pages', async () => {
  const original = globalThis.fetch;
  let firstSignal: AbortSignal | undefined;
  let calls = 0;
  globalThis.fetch = async (_input, init) => {
    calls++;
    const signal = init?.signal as AbortSignal;
    if (calls === 1) {
      firstSignal = signal;
      return Response.json({ docs: [], nextPage: 2 });
    }
    assert.equal(signal, firstSignal);
    return Response.json({ docs: [], nextPage: null });
  };
  try {
    const response = await GET();
    assert.equal(response.status, 200);
    assert.equal(calls, 2);
  } finally { globalThis.fetch = original; }
});

test('catalog aborts stalled pagination at the overall deadline', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (_input, init) => {
    calls++;
    if (calls === 1) return Response.json({ docs: [], nextPage: 2 });
    const signal = init?.signal as AbortSignal;
    return new Promise<Response>((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(signal.reason), { once: true });
    });
  };
  try {
    const started = Date.now();
    const response = await GET();
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(calls, 2);
    assert.ok(Date.now() - started < 6000);
  } finally { globalThis.fetch = original; }
});
