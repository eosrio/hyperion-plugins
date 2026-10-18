# Hyperion plugin catalog

The official EOS Rio catalog repository for Hyperion plugins and their declared compatibility.

## Hyperion 4.5 organization

Track [catalog/SDK foundation issue #19](https://github.com/eosrio/hyperion-tools/issues/19) and
[release coordination #24](https://github.com/eosrio/hyperion-tools/issues/24).

The [approved architecture](https://github.com/eosrio/hyperion-tools/blob/a36fda12ba813968ce361e85893206d8f5bceb0f/docs/architecture/hyperion-4.5.md) and
[release roadmap](https://github.com/eosrio/hyperion-tools/blob/a36fda12ba813968ce361e85893206d8f5bceb0f/docs/roadmap/hyperion-4.5.md) define the extension model.

First-party development repositories:

- [Hyperion SDK](https://github.com/eosrio/hyperion-sdk)
- [AtomicAssets and AtomicMarket plugin](https://github.com/eosrio/hyperion-atomicassets-plugin)
- [Wire chain extension](https://github.com/eosrio/hyperion-wire-plugin)

These repositories are development scaffolds. No 4.5-compatible plugin releases are declared here.

## Current catalog and migration

[catalog.json](catalog.json) retains its existing SimpleAssets and Telos EVM entries and legacy
format. Those entries do not declare 4.5 SDK/core compatibility; their presence is not qualification.

P01 in the [initial issue batch](https://github.com/eosrio/hyperion-tools/blob/a36fda12ba813968ce361e85893206d8f5bceb0f/docs/roadmap/hyperion-4.5-initial-issues.md) tracks the
compatibility metadata format, validation fixtures, consumer audit and explicit legacy-entry policy.
This preparation does not migrate the catalog format or invent release pins.

Before introducing compatibility metadata, identify consumers and document their migration.
Declare compatible SDK/core versions, exact qualified artifacts and required components through the
reviewed format. Keep engine versions distinct from adapter package versions.

## Operator and release policy

- Catalog metadata informs plugin selection and declares compatibility.
- Hyperion releases pin tested component combinations.
- Catalog changes do not automatically upgrade running executable code.
- Operators choose and audit the executable plugins they install.
- Only record supported versions after applicable conformance and integration qualification.

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md).
Run `python scripts/validate-catalog.py` to check the existing catalog structure.
This check does not establish artifact integrity or runtime compatibility.

Licensed under [MIT](LICENSE).
