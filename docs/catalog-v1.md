# Catalog schema 1

`catalog.v1.json` is an opt-in metadata file. It is separate from the unchanged legacy
`catalog.json`. The checked-in file has no component declarations or tested sets because
no 4.5 component releases have been qualified. This is metadata tooling, not a plugin installer.

The maintainer interface is `validateCatalog(unknown)` from `scripts/catalog-validation.mjs`.
It returns `{ valid: true, catalog }` or `{ valid: false, errors: string[] }`.
The CLI `node scripts/validate-catalog-v1.mjs [catalog JSON path]` exits 0 for accepted metadata
and 1 for invalid metadata, unreadable files or malformed JSON. When no path is supplied,
it reads the repository's `catalog.v1.json`.

## Structure

Objects reject unknown fields. All fields below are required. Arrays may be empty only where
explicitly stated. Incompatible format changes require a new schema version and an explicit
consumer migration; the current validator accepts only schema 1.

| Object | Fields and meaning |
| --- | --- |
| Catalog | `schemaVersion: 1`, `components: []`, `testedSets: []`. Both arrays may be empty. |
| Component declaration | `repository`: HTTPS source repository URL without credentials, query or fragment; `commit`: full lowercase Git commit hash; `manifest`: canonical SDK component manifest. |
| Tested set | `id`: unique nonempty identifier; `hyperion`: core source pin; `sdk`: SDK source pin; `components`: nonempty array of component pins; `engines`: exact engine-version map, which may be empty; `evidence`: nonempty array of HTTPS qualification evidence URLs without credentials. |
| Core or SDK source pin | `version`: exact semver; `commit`: full lowercase Git commit hash. Core commits belong to `eosrio/hyperion-history-api`, SDK commits to `eosrio/hyperion-sdk`. |
| Component pin | `package`, `version`, `commit`, matching one declaration exactly. Its source repository comes from that declaration. Each package appears at most once per tested set. |

Full Git commit hashes are 40 hexadecimal characters for SHA-1 repositories or 64 for SHA-256
repositories. Branches, tags and abbreviated hashes are not immutable source pins here.
Each package/version has one declaration; changing its source requires a new declared version.

The canonical manifest schema is exported as
`@eosrio/hyperion-sdk/component-manifest.schema.json`. This repository calls
`validateComponentManifest` and `checkCompatibility` from that same SDK package.
It does not copy the descriptor schema, parse semver ranges or implement separate prerelease rules.
Backend adapter package versions remain distinct from their required database engine versions.

The [synthetic fixture](../tests/fixtures/synthetic-catalog.json) is a complete format example.
All its packages, versions, source hashes and `example.invalid` URLs are invented test data,
not production declarations or qualification results.

## Declaration, eligibility and qualification

A component declaration records what its author claims the source supports. Declarations may
exist without a tested set. Every tested-set component must resolve to a declaration with the
same package, version and source commit. Its core, SDK and engine versions must pass the SDK's
compatibility check against that declaration. Versions in the tested environment are exact;
only manifest compatibility fields contain ranges. Standard semver prerelease eligibility
comes from the SDK.

Adding a tested set is a maintainer assertion that qualification evidence exists for that exact
combination. Evidence should identify the sources, environment, checks, results and applicable
limits, including the contracts or chain/protocol profile exercised. Reviewers must inspect
it before accepting a production entry. The validator checks URL structure and declared
eligibility; it does not fetch evidence, verify remote commits, verify build artifact integrity,
rerun integration tests or prove that the evidence covers the claimed combination.

This foundation records source provenance, not a downloadable artifact installation manifest.
Distribution artifact digests and installer enforcement belong to release packaging work.
The catalog is not an approval to execute code or an automatic update trigger. Operators
continue choosing and auditing installed code; Hyperion releases separately pin qualified
component combinations.

A tested set describes a tested combination of packages and engine versions, not a chain's
active configuration. It does not select a state backend. Hyperion 4.5 still uses one active
state backend per chain. A distribution or multi-chain qualification can contain multiple
adapter packages without making them simultaneously active on a chain.

## Checks

Run `npm ci`, `npm test`, `npm run validate` and the legacy Python check documented in
[README.md](../README.md). The SDK tooling dependency is pinned to a development source commit;
that pin is not itself a claim that the SDK is a qualified release.
