import { checkCompatibility, validateComponentManifest } from '@eosrio/hyperion-sdk';

/** Validate catalog metadata; this does not execute plugins or establish runtime qualification. */
export function validateCatalog(catalog) {
  const errors = [];
  if (!object(catalog, ['schemaVersion', 'components', 'testedSets'], 'catalog', errors)) {
    return { valid: false, errors };
  }
  if (catalog.schemaVersion !== 1) errors.push('catalog.schemaVersion must be 1');
  if (!Array.isArray(catalog.components)) errors.push('catalog.components must be an array');
  if (!Array.isArray(catalog.testedSets)) errors.push('catalog.testedSets must be an array');
  const declarations = new Map();
  if (Array.isArray(catalog.components)) catalog.components.forEach((component, index) => {
    const path = `catalog.components[${index}]`;
    if (!object(component, ['repository', 'commit', 'manifest'], path, errors)) return;
    if (!httpsUrl(component.repository, true)) errors.push(`${path}.repository must be an HTTPS source URL without credentials, query or fragment`);
    if (!commit(component.commit)) errors.push(`${path}.commit must be a full lowercase Git commit hash`);
    const result = validateComponentManifest(component.manifest);
    if (!result.valid) {
      for (const error of result.errors) errors.push(`${path}.manifest${error.path}: ${error.message}`);
      return;
    }
    const key = `${result.manifest.package}@${result.manifest.version}`;
    if (declarations.has(key)) errors.push(`${path} duplicates package/version ${key}`);
    declarations.set(key, component);
  });
  const ids = new Set();
  if (Array.isArray(catalog.testedSets)) catalog.testedSets.forEach((testedSet, index) => {
    const path = `catalog.testedSets[${index}]`;
    if (!object(testedSet, ['id', 'hyperion', 'sdk', 'components', 'engines', 'evidence'], path, errors)) return;
    if (typeof testedSet.id !== 'string' || !testedSet.id.trim()) errors.push(`${path}.id must be a nonempty string`);
    else if (ids.has(testedSet.id)) errors.push(`${path}.id is duplicated`);
    ids.add(testedSet.id);
    for (const name of ['hyperion', 'sdk']) {
      const context = testedSet[name];
      if (object(context, ['version', 'commit'], `${path}.${name}`, errors)) {
        if (typeof context.version !== 'string') errors.push(`${path}.${name}.version must be an exact version string`);
        if (!commit(context.commit)) errors.push(`${path}.${name}.commit must be a full lowercase Git commit hash`);
      }
    }
    if (!testedSet.engines || typeof testedSet.engines !== 'object' || Array.isArray(testedSet.engines)) {
      errors.push(`${path}.engines must map engine names to exact version strings`);
    }
    if (!Array.isArray(testedSet.evidence) || !testedSet.evidence.length || !testedSet.evidence.every(url => httpsUrl(url))) {
      errors.push(`${path}.evidence must contain HTTPS qualification evidence URLs without credentials`);
    }
    if (!Array.isArray(testedSet.components) || !testedSet.components.length) {
      errors.push(`${path}.components must contain at least one declared component`);
      return;
    }
    const packages = new Set();
    testedSet.components.forEach((pin, pinIndex) => {
      const pinPath = `${path}.components[${pinIndex}]`;
      if (!object(pin, ['package', 'version', 'commit'], pinPath, errors)) return;
      if (typeof pin.package !== 'string' || typeof pin.version !== 'string') {
        errors.push(`${pinPath} must identify a declared package and exact version`);
        return;
      }
      if (packages.has(pin.package)) errors.push(`${pinPath}.package is duplicated in this tested set`);
      packages.add(pin.package);
      const declaration = declarations.get(`${pin.package}@${pin.version}`);
      if (!declaration) errors.push(`${pinPath} has no matching package/version declaration`);
      else {
        if (pin.commit !== declaration.commit) errors.push(`${pinPath}.commit does not match its declaration`);
        const result = checkCompatibility(declaration.manifest, {
          hyperion: testedSet.hyperion?.version,
          sdk: testedSet.sdk?.version,
          engines: testedSet.engines
        });
        for (const error of result.errors) errors.push(`${pinPath}${error.path}: ${error.message}`);
      }
    });
  });
  return errors.length ? { valid: false, errors } : { valid: true, catalog };
}

function commit(value) {
  return typeof value === 'string' && /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(value);
}

function httpsUrl(value, source = false) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password &&
      (!source || (!url.search && !url.hash));
  } catch {
    return false;
  }
}

function object(value, fields, path, errors) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${path} must be an object`);
    return false;
  }
  for (const field of Object.keys(value)) {
    if (!fields.includes(field)) errors.push(`${path}.${field} is not supported`);
  }
  return true;
}
