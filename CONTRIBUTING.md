# Contributing

EOS Rio maintains the official Hyperion catalog. Describe the affected plugins, consumers,
compatibility evidence and migration impact in each pull request.

Preserve existing catalog consumers until their migration is reviewed. Do not add speculative
release versions or mark the 4.5 development scaffolds compatible.

Run `python scripts/validate-catalog.py` for changes. This validates the legacy catalog structure;
additional compatibility validation belongs to the reviewed metadata migration.
