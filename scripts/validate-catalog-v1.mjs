import { readFile } from 'node:fs/promises';
import { validateCatalog } from './catalog-validation.mjs';

if (process.argv.length > 3) {
  console.error('Usage: node scripts/validate-catalog-v1.mjs [catalog JSON path]');
  process.exitCode = 1;
} else {
  const file = process.argv[2] ?? new URL('../catalog.v1.json', import.meta.url);
  let catalog;
  try {
    catalog = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    console.error(`Cannot read catalog JSON: ${error.message}`);
    process.exitCode = 1;
  }
  if (!process.exitCode) {
    const result = validateCatalog(catalog);
    if (!result.valid) {
      for (const error of result.errors) console.error(error);
      process.exitCode = 1;
    } else {
      console.log(`Validated ${catalog.components.length} declarations and ${catalog.testedSets.length} tested sets: metadata validation does not establish runtime qualification.`);
    }
  }
}
