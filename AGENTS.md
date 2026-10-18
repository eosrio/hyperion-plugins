# Catalog agent guidance

Read [README.md](README.md) and the linked architecture before editing metadata.

- Preserve legacy entries and consumers until an explicit migration is implemented and qualified.
- Do not claim SDK/core/plugin compatibility from a repository scaffold or a source inspection.
- Exact component release pins require qualification evidence.
- Catalog metadata must not initiate executable upgrades.
- Keep database-engine versions separate from independently versioned adapter extensions.

- `catalog.v1.json` is the explicit opt-in compatibility format; `catalog.json` remains legacy.
- Use `@eosrio/hyperion-sdk` for manifest validation and semver eligibility. Do not duplicate it.
- Development fixture versions and hashes are synthetic. Keep production entries empty until
  reviewed qualification supports exact source and environment pins.
- Run the Node metadata tests/validator and the existing Python legacy check.

Read [format policy](docs/catalog-v1.md) and [consumer audit](docs/legacy-consumers.md).
P01 also tracks adapter ownership and existing plugin migration outside this repository.
