# Synthetic metadata fixtures

`synthetic-catalog.json` uses invented package names, versions, source hashes and
`example.invalid` URLs. It exercises accepted metadata; tests mutate it to exercise rejection
of invalid declarations, source pins, evidence and incompatible environments.

It is not a list of real plugins, a release compatibility matrix or runtime qualification
evidence. Production `catalog.v1.json` intentionally contains no entries.
