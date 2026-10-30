import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = await mkdtemp(path.join(tmpdir(), 'subnet-client-key-check-'));
const privateKeys = ['VITE_ANTHROPIC_API_KEY', 'VITE_IONET_API_KEY',
  'VITE_TAOSTATS_USERNAME', 'VITE_TAOSTATS_PASSWORD', 'IONET_API_KEY'];
// Synthetic markers only. Never read real credentials from the invoking shell.
const canaries = Object.fromEntries(privateKeys.map((key, i) => [key, `PRIVATE_BUILD_CANARY_${i}_MUST_NOT_SHIP`]));
try {
  const build = spawnSync(process.execPath, ['node_modules/vite/bin/vite.js',
    'build', '--outDir', output, '--emptyOutDir'], {
    cwd: root, env: { PATH: process.env.PATH, ...canaries }, encoding: 'utf8', timeout: 60000,
  });
  assert.equal(build.status, 0, `Canary build failed (${build.status}); output intentionally withheld`);
  async function inspect(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) await inspect(filename);
      else {
        const bytes = await readFile(filename);
        for (const key of privateKeys) assert.ok(!bytes.includes(Buffer.from(canaries[key])),
          `Private provider configuration reached built output: ${key}`);
      }
    }
  }
  await inspect(output);
  console.log('PASS: no private provider canaries in the production build');
} finally {
  await rm(output, { recursive: true, force: true });
}
