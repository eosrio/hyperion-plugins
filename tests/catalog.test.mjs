import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { validateCatalog } from '../scripts/catalog-validation.mjs';

const fixture = JSON.parse(await readFile(new URL('fixtures/synthetic-catalog.json', import.meta.url), 'utf8'));

test('an empty versioned catalog can be accepted before any releases are declared', () => {
  const catalog = { schemaVersion: 1, components: [], testedSets: [] };
  assert.deepEqual(validateCatalog(catalog), { valid: true, catalog });
});

test('declared manifests use the SDK validation rules and need immutable source provenance', () => {
  assert.equal(validateCatalog(structuredClone(fixture)).valid, true);
  for (const change of [
    catalog => { catalog.components[0].manifest.compatibility.sdk = 'not a range'; },
    catalog => { catalog.components[0].manifest.nativeQuery = 'invented'; },
    catalog => { catalog.components[1].manifest.compatibility.engines = []; },
    catalog => { catalog.components[0].commit = 'main'; },
    catalog => { catalog.components[0].repository = 'http://example.invalid/repo'; },
    catalog => { catalog.components.push(structuredClone(catalog.components[0])); }
  ]) {
    const catalog = structuredClone(fixture);
    change(catalog);
    const result = validateCatalog(catalog);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(error => error.startsWith('catalog.components')));
  }
});

test('invalid or unknown catalog envelopes produce diagnostics instead of being accepted', () => {
  for (const catalog of [null, [], {}, { schemaVersion: 2, components: [], testedSets: [] },
    { schemaVersion: 1, components: {}, testedSets: [] },
    { schemaVersion: 1, components: [], testedSets: [], autoUpgrade: true }]) {
    const result = validateCatalog(catalog);
    assert.equal(result.valid, false);
    assert.ok(result.errors.length > 0);
  }
});

test('tested sets require declared exact source pins and evidence provenance', () => {
  for (const change of [
    catalog => { catalog.testedSets[0].components[0].commit = 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'; },
    catalog => { catalog.testedSets[0].components[0].package = '@fixture/missing'; },
    catalog => { catalog.testedSets[0].components[0].version = '2.0.0'; },
    catalog => { catalog.testedSets[0].components.push(structuredClone(catalog.testedSets[0].components[0])); },
    catalog => { catalog.testedSets.push(structuredClone(catalog.testedSets[0])); },
    catalog => { catalog.testedSets[0].components = []; },
    catalog => { catalog.testedSets[0].hyperion.commit = 'main'; },
    catalog => { catalog.testedSets[0].sdk.unknown = true; },
    catalog => { catalog.testedSets[0].evidence = []; },
    catalog => { catalog.testedSets[0].evidence = ['file:///local-result']; },
    catalog => { catalog.testedSets[0].engines = []; },
    catalog => { catalog.testedSets[0].autoInstall = true; }
  ]) {
    const catalog = structuredClone(fixture);
    change(catalog);
    const result = validateCatalog(catalog);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(error => error.startsWith('catalog.testedSets')));
  }
});

test('each pinned component must be eligible for the exact tested environment according to the SDK', () => {
  for (const change of [
    catalog => { catalog.testedSets[0].hyperion.version = '4.4.0'; },
    catalog => { catalog.testedSets[0].hyperion.version = '4.5.0-rc.1'; },
    catalog => { catalog.testedSets[0].sdk.version = '2.0.0'; },
    catalog => { catalog.testedSets[0].sdk.version = '^1.0.0'; },
    catalog => { catalog.testedSets[0].engines.mongodb = '6.0.0'; },
    catalog => { catalog.testedSets[0].engines = {}; },
    catalog => { catalog.testedSets[0].engines.unused = '^1.0.0'; }
  ]) {
    const catalog = structuredClone(fixture);
    change(catalog);
    const result = validateCatalog(catalog);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(error => error.startsWith('catalog.testedSets')));
  }
});

test('the maintainer CLI returns success only for valid metadata and reports rejection without a stack trace', async () => {
  const cli = fileURLToPath(new URL('../scripts/validate-catalog-v1.mjs', import.meta.url));
  const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
  assert.equal(run().status, 0);
  const fixtureResult = run(fileURLToPath(new URL('fixtures/synthetic-catalog.json', import.meta.url)));
  assert.equal(fixtureResult.status, 0);
  assert.match(fixtureResult.stdout, /metadata.*does not establish runtime qualification/i);

  const temporary = await mkdtemp(join(tmpdir(), 'hyperion-catalog-test-'));
  try {
    const file = join(temporary, 'catalog.json');
    const invalid = structuredClone(fixture);
    invalid.testedSets[0].hyperion.version = '4.4.0';
    await writeFile(file, JSON.stringify(invalid));
    const rejected = run(file);
    assert.equal(rejected.status, 1);
    assert.match(rejected.stderr, /catalog.testedSets/);
    assert.doesNotMatch(rejected.stderr, /at .*\.mjs/);
    await writeFile(file, '{');
    const malformed = run(file);
    assert.equal(malformed.status, 1);
    assert.match(malformed.stderr, /Cannot read catalog JSON/);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
