# Contributing

EOS Rio maintains the official Hyperion catalog. Describe the affected plugins, consumers,
compatibility evidence and migration impact in each pull request.

Preserve existing catalog consumers until their migration is reviewed. Do not add speculative
release versions or mark the 4.5 development scaffolds compatible.

Keep `catalog.json` unchanged during the schema 1 introduction. Follow the
[versioned format](docs/catalog-v1.md) and [legacy consumer policy](docs/legacy-consumers.md).
The SDK's exported component schema and validator are canonical; do not copy them or implement
another semver matcher in this repository.

Run `npm ci`, `npm test`, `npm run validate` and `python scripts/validate-catalog.py`.
Tests use synthetic fixtures; adding a production tested set also requires reviewed runtime
qualification evidence. Metadata checks never authorize executable updates.
