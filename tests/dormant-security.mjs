import assert from 'node:assert/strict';
import { once } from 'node:events';
import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import http from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import test from 'node:test';
import express from 'express';
import { denyDormantAdmin, LOCAL_HOST, parkedTokenVerification } from '../shared/config/dormant.js';
import apiClient from '../shared/utils/apiClient.js';
import { ENV_CONFIG } from '../src/config/env.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const request = (port, pathname, method = 'GET', body = '') => new Promise((resolve, reject) => {
  const req = http.request({ host: LOCAL_HOST, port, path: pathname, method,
    headers: { 'Content-Length': Buffer.byteLength(body) } }, res => {
    let data = '';
    res.setEncoding('utf8');
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data || '{}') }));
  });
  req.on('error', reject);
  req.end(body);
});
const blockedPaths = [
  '/api/scoutbrief/admin',
  '/api/scoutbrief/admin/context',
  '/api/scoutbrief/admin/context/1',
  '/api/scoutbrief/admin/start-analysis',
  '/api/scoutbrief/admin/generate?quarter=Q1',
  '/API/SCOUTBRIEF/ADMIN/contexts/',
  '/api/scoutbrief/%61dmin/generate',
  '/api/scoutbrief/admin%2fgenerate',
  '/api/scoutbrief/public/../admin/latest-report',
];

test('raw backend blocks admin work before reading bodies or changing data', { timeout: 10000 }, async t => {
  const cwd = await mkdtemp(path.join(tmpdir(), 'subnet-security-test-'));
  const child = spawn(process.execPath, [
    '--require', path.join(root, 'tests/helpers/offline-server.cjs'),
    path.join(root, 'simple-backend.js'),
  ], { cwd, env: { PORT: '0', NODE_ENV: 'test' }, stdio: ['ignore', 'ignore', 'ignore', 'ipc'] });
  t.after(async () => {
    if (child.exitCode === null) {
      child.kill('SIGTERM');
      await once(child, 'exit');
    }
    await rm(cwd, { recursive: true, force: true });
  });
  const address = await new Promise((resolve, reject) => {
    child.once('message', value => resolve(value.testAddress));
    child.once('exit', code => reject(new Error(`Test backend exited before listening: ${code}`)));
    child.once('error', reject);
  });
  assert.equal(address.address, LOCAL_HOST);
  // This used to return success and persist context without a login.
  const mutation = await request(address.port, '/api/scoutbrief/admin/context', 'POST',
    JSON.stringify({ quarter: 'Q1', year: 2026, context: 'fictional offline test' }));
  assert.equal(mutation.status, 503);
  for (const pathname of blockedPaths) {
    for (const method of ['GET', 'POST', 'DELETE', 'OPTIONS']) {
      const result = await request(address.port, pathname, method, '{invalid-json');
      assert.equal(result.status, 503, `${method} ${pathname}`);
      assert.equal(result.body.error, 'DORMANT_ADMIN_DISABLED');
    }
  }
  assert.equal((await request(address.port, '/api/scoutbrief/admin/%zz')).status, 400);
  const health = await request(address.port, '/health');
  assert.equal(health.status, 200);
  assert.equal(health.body.status, 'healthy');
  assert.equal(health.headers['x-content-type-options'], 'nosniff');
  assert.ok(health.headers['x-frame-options'] || health.headers['content-security-policy']);
  const dataFiles = await readdir(path.join(cwd, 'data'));
  assert.ok(dataFiles.includes('simple-backend.db'), 'SQLite initializes without a tracked snapshot');
  assert.ok(!dataFiles.includes('scoutbrief.db'), 'backend variants must not share incompatible schemas');
  assert.ok(!dataFiles.includes('contexts.json'), 'denied writes must not persist context');
  assert.ok(!dataFiles.includes('reports.json'), 'denied generation must not persist reports');
});

test('Express guard covers case, trailing-slash and encoded representations', async t => {
  const app = express();
  let mutations = 0;
  app.use((req, res, next) => { if (!denyDormantAdmin(req, res)) next(); });
  app.use(express.json());
  app.post('/api/scoutbrief/admin/context', (req, res) => { mutations++; res.json({ success: true }); });
  app.get('/health', (req, res) => res.json({ status: 'healthy' }));
  const server = app.listen(0, LOCAL_HOST);
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  for (const pathname of blockedPaths) {
    assert.equal((await request(server.address().port, pathname, 'POST', '{invalid-json')).status, 503);
  }
  assert.equal(mutations, 0);
  assert.equal((await request(server.address().port, '/health')).status, 200);
  const source = await readFile(path.join(root, 'backend/pingAgent.js'), 'utf8');
  assert.ok(source.indexOf('denyDormantAdmin(req, res)') < source.indexOf('app.use(session('));
  assert.ok(source.indexOf('denyDormantAdmin(req, res)') < source.indexOf('app.use(express.json('));
});

test('direct browser providers refuse live access and retain mock behavior', async t => {
  let calls = 0;
  const fetchOriginal = globalThis.fetch;
  const modeOriginal = apiClient.useMock;
  t.after(() => { globalThis.fetch = fetchOriginal; apiClient.useMock = modeOriginal; });
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.ok(url.startsWith('http://localhost:3001/'));
    if (url.includes('taostats')) assert.equal(options.headers.Authorization, 'mock:credentials');
    return { ok: true, json: async () => ({ data: 'offline fixture' }) };
  };
  apiClient.useMock = false;
  await assert.rejects(apiClient.getIoNetAgents(), /DORMANT_DIRECT_PROVIDER_DISABLED/);
  await assert.rejects(apiClient.getTaoStatsData(), /DORMANT_DIRECT_PROVIDER_DISABLED/);
  assert.equal(calls, 0);
  assert.ok(!Object.keys(ENV_CONFIG).some(key => /API_KEY|PASSWORD|TAOSTATS_USERNAME/.test(key)));
  apiClient.useMock = true;
  assert.deepEqual(await apiClient.getIoNetAgents(), { data: 'offline fixture' });
  assert.deepEqual(await apiClient.getTaoStatsData(), { data: 'offline fixture' });
  assert.equal(calls, 2);
});

test('all dormant server listener variants use loopback', async () => {
  for (const relative of ['simple-backend.js', 'shared/config/https.js', 'backend/mock-server.js']) {
    const source = await readFile(path.join(root, relative), 'utf8');
    const calls = [...source.matchAll(/\.listen\(([^\n]+)/g)];
    assert.ok(calls.length > 0);
    for (const call of calls) assert.match(call[1], /, LOCAL_HOST, /);
  }
  const vite = await readFile(path.join(root, 'vite.config.js'), 'utf8');
  assert.equal([...vite.matchAll(/host: LOCAL_HOST/g)].length, 2);
});

test('legacy login refuses every token without an authentication SDK', async () => {
  for (const token of [undefined, '', 'not-a-token', 'mock.test.token']) {
    assert.deepEqual(await parkedTokenVerification(token), {
      valid: false, error: 'AUTHENTICATION_PARKED',
    });
  }
  const service = await readFile(path.join(root, 'shared/utils/ethosService.js'), 'utf8');
  assert.match(service, /verifyPrivyToken = parkedTokenVerification/);
  assert.ok(!service.includes('@privy-io/server-auth'));
});

test('alternate SQLite initialization creates a clean schema without saved customer data', async t => {
  const workspace = await mkdtemp(path.join(tmpdir(), 'subnet-clean-schema-'));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const directory = path.join(workspace, 'shared/utils');
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(workspace, 'package.json'), '{"type":"module"}');
  await symlink(path.join(root, 'node_modules'), path.join(workspace, 'node_modules'), 'dir');
  const module = path.join(directory, 'scoutbriefDatabase.js');
  await copyFile(path.join(root, 'shared/utils/scoutbriefDatabase.js'), module);
  const { default: db } = await import(pathToFileURL(module));
  try {
    assert.equal(db.healthCheck().status, 'healthy');
    assert.deepEqual(db.getStats(), { active_subscribers: 0, brief_contexts: 0, brief_generations: 0 });
    assert.deepEqual(db.getSubscribers(), []);
    assert.deepEqual(db.getAllContexts(), []);
    assert.deepEqual(db.getAllReports(), []);
  } finally { db.close(); }
});

test('legacy identity helpers refuse access before warm caches, aggregation or provider requests', async t => {
  const workspace = await mkdtemp(path.join(tmpdir(), 'subnet-parked-identity-'));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const directory = path.join(workspace, 'shared/utils');
  await mkdir(directory, { recursive: true });
  await mkdir(path.join(workspace, 'shared/config'));
  await writeFile(path.join(workspace, 'package.json'), '{"type":"module"}');
  await copyFile(path.join(root, 'shared/utils/ethosService.js'), path.join(directory, 'ethosService.js'));
  await copyFile(path.join(root, 'shared/config/dormant.js'), path.join(workspace, 'shared/config/dormant.js'));
  await writeFile(path.join(directory, 'logger.js'), 'export default {info(){},warn(){},error(){},debug(){}};');
  await writeFile(path.join(directory, 'cacheService.js'), `
    export let cacheReads = 0;
    export default { async get(){cacheReads++; return {fixture: 'cached identity'}}, async set(){} };
  `);
  const { default: service } = await import(pathToFileURL(path.join(directory, 'ethosService.js')));
  const cache = await import(pathToFileURL(path.join(directory, 'cacheService.js')));
  for (const method of ['getUserProfile', 'getUserScore', 'getUserReviews',
    'getUserActivities', 'getComprehensiveIdentity', 'makeRequest']) {
    await assert.rejects(service[method]('fictional-user', 'not-a-token'), /AUTHENTICATION_PARKED/);
  }
  assert.equal(cache.cacheReads, 0, 'warm caches must not bypass the parked boundary');
});
