import assert from 'node:assert/strict';
import test from 'node:test';

process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/test_db';
process.env.JWT_SECRET ??= 'test-secret';
process.env.JWT_EXPIRES_IN ??= '1d';

async function createApp() {
  const { buildApp } = await import('./app.js');
  return buildApp();
}

async function createToken(role: 'ADMIN' | 'USER') {
  const { default: jwt } = await import('@fastify/jwt');
  const fastify = (await import('fastify')).default;

  const app = fastify();

  try {
    await app.register(jwt, {
      secret: process.env.JWT_SECRET as string,
    });

    return await app.jwt.sign({
      sub: 'test-user-id',
      email: 'tester@example.com',
      role,
    });
  } finally {
    await app.close();
  }
}

test('GET /api/health returns healthy payload', async () => {
  const app = await createApp();

  try {
    const res = await app.inject({
      method: 'GET',
      url: '/api/health',
    });

    assert.equal(res.statusCode, 200);

    const body = res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.status, 'ok');
    assert.equal(typeof body.data.timestamp, 'string');
  } finally {
    await app.close();
  }
});

test('GET /docs/json exposes populated OpenAPI paths', async () => {
  const app = await createApp();

  try {
    const res = await app.inject({
      method: 'GET',
      url: '/docs/json',
    });

    assert.equal(res.statusCode, 200);

    const body = res.json();
    assert.equal(body.openapi, '3.0.3');
    assert.equal(typeof body.paths, 'object');
    assert.ok(Object.keys(body.paths).length > 0);
    assert.ok(body.paths['/health/']);
    assert.ok(body.paths['/public/pages/{slug}']);
    assert.ok(body.paths['/admin/public-pages']);
  } finally {
    await app.close();
  }
});

test('GET /api/admin/users without token returns 401', async () => {
  const app = await createApp();

  try {
    const res = await app.inject({
      method: 'GET',
      url: '/api/admin/users',
    });

    assert.equal(res.statusCode, 401);

    const body = res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'UNAUTHORIZED');
  } finally {
    await app.close();
  }
});

test('POST /api/auth/login validates body and returns 400', async () => {
  const app = await createApp();

  try {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {},
    });

    assert.equal(res.statusCode, 400);

    const body = res.json();
    assert.equal(body.success, false);
  } finally {
    await app.close();
  }
});

test('GET /api/auth/me without token returns 401', async () => {
  const app = await createApp();

  try {
    const res = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
    });

    assert.equal(res.statusCode, 401);

    const body = res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'UNAUTHORIZED');
  } finally {
    await app.close();
  }
});

test('POST /api/auth/register validates password minimum length', async () => {
  const app = await createApp();

  try {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        name: 'Tester',
        email: 'tester@example.com',
        password: 'short',
      },
    });

    assert.equal(res.statusCode, 400);

    const body = res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'REQUEST_ERROR');
  } finally {
    await app.close();
  }
});

test('GET /api/public/articles/latest validates query limit max', async () => {
  const app = await createApp();

  try {
    const res = await app.inject({
      method: 'GET',
      url: '/api/public/articles/latest?limit=999',
    });

    assert.equal(res.statusCode, 400);

    const body = res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'REQUEST_ERROR');
  } finally {
    await app.close();
  }
});

test('GET /api/public/categories validates page minimum', async () => {
  const app = await createApp();

  try {
    const res = await app.inject({
      method: 'GET',
      url: '/api/public/categories?page=0',
    });

    assert.equal(res.statusCode, 400);

    const body = res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'REQUEST_ERROR');
  } finally {
    await app.close();
  }
});

test('POST /api/public/participants/register validates required payload', async () => {
  const app = await createApp();

  try {
    const res = await app.inject({
      method: 'POST',
      url: '/api/public/participants/register',
      payload: {
        name: 'No Schedule',
      },
    });

    assert.equal(res.statusCode, 400);

    const body = res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'REQUEST_ERROR');
  } finally {
    await app.close();
  }
});

test('POST /api/public/contact-inquiries validates required payload', async () => {
  const app = await createApp();

  try {
    const res = await app.inject({
      method: 'POST',
      url: '/api/public/contact-inquiries',
      payload: {
        name: 'Tester',
      },
    });

    assert.equal(res.statusCode, 400);

    const body = res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'REQUEST_ERROR');
  } finally {
    await app.close();
  }
});

test('GET /api/admin/users with USER token returns 403', async () => {
  const token = await createToken('USER');
  const app = await createApp();

  try {
    const res = await app.inject({
      method: 'GET',
      url: '/api/admin/users',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const body = res.json();

    if (res.statusCode === 401) {
      assert.equal(body.success, false);
      assert.equal(body.error.code, 'UNAUTHORIZED');
      return;
    }

    assert.equal(res.statusCode, 403);

    assert.equal(body.success, false);
    assert.equal(body.error.code, 'FORBIDDEN');
  } finally {
    await app.close();
  }
});

test('POST /api/admin/users with ADMIN token validates request body', async () => {
  const token = await createToken('ADMIN');
  const app = await createApp();

  try {
    const res = await app.inject({
      method: 'POST',
      url: '/api/admin/users',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        name: 'Admin Test',
      },
    });

    assert.equal(res.statusCode, 400);

    const body = res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'REQUEST_ERROR');
  } finally {
    await app.close();
  }
});

test('PATCH /api/admin/categories/:id with ADMIN token validates body', async () => {
  const token = await createToken('ADMIN');
  const app = await createApp();

  try {
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/admin/categories/test-id',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {},
    });

    assert.equal(res.statusCode, 400);

    const body = res.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'REQUEST_ERROR');
  } finally {
    await app.close();
  }
});
