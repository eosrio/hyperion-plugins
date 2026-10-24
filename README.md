# Hyperion plugin catalog

The official EOS Rio catalog repository for Hyperion plugins and their declared compatibility.

## Hyperion 4.5 organization

[SDK, runtime and adapter source homes](https://github.com/eosrio/hyperion-tools/blob/458e1127b99c025251055e160129010edcecc78a/docs/architecture/hyperion-4.5-component-homes.md)
define package ownership; assigned homes are not implementation or release-support claims.

Track [catalog/SDK foundation issue #19](https://github.com/eosrio/hyperion-tools/issues/19) and
[release coordination #24](https://github.com/eosrio/hyperion-tools/issues/24).

The [approved architecture](https://github.com/eosrio/hyperion-tools/blob/a36fda12ba813968ce361e85893206d8f5bceb0f/docs/architecture/hyperion-4.5.md) and
[release roadmap](https://github.com/eosrio/hyperion-tools/blob/a36fda12ba813968ce361e85893206d8f5bceb0f/docs/roadmap/hyperion-4.5.md) define the extension model.

First-party development repositories:

- [Hyperion SDK](https://github.com/eosrio/hyperion-sdk)
- [AtomicAssets and AtomicMarket plugin](https://github.com/eosrio/hyperion-atomicassets-plugin)
- [Wire chain extension](https://github.com/eosrio/hyperion-wire-plugin)

These repositories are development scaffolds. No 4.5-compatible plugin releases are declared here.

## Versioned compatibility metadata

[catalog.v1.json](catalog.v1.json) contains the schema 1 declarations and exact tested sets.
It is intentionally empty while 4.5 components are under development. Read the
[format and qualification policy](docs/catalog-v1.md) before adding an entry.
The validator uses the SDK's component manifest and compatibility checks; it does not install,
import or update executable plugins.

The [synthetic fixture](tests/fixtures/synthetic-catalog.json) demonstrates the format only.
Its names, versions, commits and evidence URLs are invented for tests.

## Legacy catalog and migration

[catalog.json](catalog.json) retains its existing SimpleAssets and Telos EVM entries and legacy
format. Those entries do not declare 4.5 SDK/core compatibility; their presence is not qualification.

The [consumer audit and migration policy](docs/legacy-consumers.md) records the checked scope
and remaining limits. Existing consumers can continue using `catalog.json`; consumers adopting
compatibility checks must opt into `catalog.v1.json`. No legacy entry is automatically converted
into a qualified release.

## Operator and release policy

- Catalog metadata informs plugin selection and declares compatibility.
- Hyperion releases pin tested component combinations.
- Catalog changes do not automatically upgrade running executable code.
- Operators choose and audit the executable plugins they install.
- Only record supported versions after applicable conformance and integration qualification.

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md).
With Node.js 24 or newer and Python available, run:

```sh
npm ci
npm test
npm run validate
python scripts/validate-catalog.py
```

These checks validate metadata and rejection behavior. They do not establish artifact integrity
or runtime compatibility. The SDK dependency is a pinned development source revision, not a
qualified Hyperion release pin.

If your npm policy blocks Git dependencies, versions supporting `allow-git` can use
`npm ci --allow-git=root` to allow only direct Git dependencies from this manifest. The only
one is the SDK's exact source revision; a global Git-fetch allowance is unnecessary.

Licensed under [MIT](LICENSE).
