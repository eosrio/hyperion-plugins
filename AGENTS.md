# Catalog agent guidance

Read [README.md](README.md) and the linked architecture before editing metadata.

- Preserve legacy entries and consumers until an explicit migration is implemented and qualified.
- Do not claim SDK/core/plugin compatibility from a repository scaffold or a source inspection.
- Exact component release pins require qualification evidence.
- Catalog metadata must not initiate executable upgrades.
- Keep database-engine versions separate from independently versioned adapter extensions.

P01 in the approved release plan owns the metadata format and consumer audit. This repository
preparation does not complete that work.
