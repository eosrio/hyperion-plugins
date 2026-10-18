# Legacy consumers and migration policy

The schema 1 introduction leaves `catalog.json` byte-identical to its prior contents.
Its legacy Git blob is `e0ca327bbc5b5e32cf36ed39ef11100d6ffedc10`.
SimpleAssets still has an empty repository field; Telos EVM still has its prior repository,
tag and `integrityHash` fields. These entries are preserved metadata, not declarations of
4.5 compatibility. No claim is made that an old `integrityHash` verifies a current artifact.

## Checked scope

This audit inspected the catalog repository at
[`421fb7d8f779e3e7dc6e20c3e8ac4cffcb14fcfc`](https://github.com/eosrio/hyperion-plugins/tree/421fb7d8f779e3e7dc6e20c3e8ac4cffcb14fcfc)
and Hyperion History API at
[`79af10986bc0e2aa84cce3788aea202d23547818`](https://github.com/eosrio/hyperion-history-api/tree/79af10986bc0e2aa84cce3788aea202d23547818).

| Checked consumer or surface | Observed behavior | Consequence |
| --- | --- | --- |
| Catalog repository's Python validator | Reads `catalog.json` and checks the existing legacy entry structure. | Keep that file and its check; add schema 1 separately. |
| History API `src/cli/hpm.ts` | `hpm install` accepts a repository option and clones that repository; enable/update operations act on locally installed plugins. | This change does not migrate `hpm` or change installation. |
| History API `src/indexer/modules/loader.ts` | Reads local plugin state and configuration, then imports enabled plugin build modules. | Schema 1 metadata does not change execution or provide a sandbox. |
| History API `src`, `README.md`, `package.json` | Bounded search for `catalog` and `hyperion-plugins` found no catalog URL or catalog-file consumer in these paths. | No runtime catalog integration is inferred from the repository name. |
| History API `package.json` | Depends on `@eosrio/hyperion-plugin-core` with `^0.1.0`. | The new SDK is not a drop-in replacement. Existing consumers need an explicit migration and qualification. |

The search was bounded to these repositories and paths. It did not audit every EOS Rio or
community repository, historical release, operator script, external service or downloaded
consumer. Absence of a match in the checked paths does not prove that legacy consumers do not
exist elsewhere. First-party plugin SDK migration is tracked separately in
[P01 / issue #19](https://github.com/eosrio/hyperion-tools/issues/19).

## Policy

1. Keep the legacy file and URL available. Do not redirect it to schema 1 or add new fields
   that silently change its meaning. Preserve existing entries during this introduction.
2. New compatibility consumers must opt into `catalog.v1.json` and reject unsupported schema
   versions. Do not treat a legacy entry as qualified or synthesize missing SDK/core ranges.
3. Migrating an entry requires an explicit schema 1 declaration, immutable source provenance
   and reviewed qualification evidence before adding an exact tested set. Existing tags or
   repository names alone do not qualify it.
4. Before changing, deprecating or removing the legacy endpoint, inventory additional consumers,
   document their migration and obtain explicit project approval. This change sets no removal date.
5. Keep executable updates operator initiated. Adoption of schema 1 must not trigger automatic
   plugin loading, installation or upgrades.
