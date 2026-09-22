# Fixture provenance

The schema and copied fixtures in this repository come from
`FoldLab/fold-spec` commit `f3fdeae` and target exact spec version
`1.0.0-draft.1`.

| File                                                   | SHA-256                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| `packages/fold-viewer/src/schema/document.schema.json` | `c3d5393bf81fab69b26c172879dcd8159b68039fe8dfd7802129950d73bed8a6` |
| `valid/crane.fold.json`                                | `a929fd12bac4d89bd050f643d66408cb8421d94842cf13dbc1e4bdde215c9995` |
| `valid/hinge.fold.json`                                | `d58f6084a6b63c28b42d13bf35476ee40ffac6724a962ef21cb443bc5ab19c94` |
| `valid/partial.fold.json`                              | `2b635d68968fd72bfe4fb11a927f3dad38606dcfa9dc6cea1a6a5ec607c9ad3d` |
| `invalid/duplicate-member.fold.json`                   | `ed067e9ef7f9f734476824fb8c67ffe1ad6189800d36839c9df4dbd6340bc7b7` |
| `invalid/nonfinite-number.fold.json`                   | `be14161622051c556081f0b81b625a417694ee9cba5b338303c31ca40a591a9c` |

To update, first review the new normative spec and schema together. Copy exact
files, update hashes and this commit reference, then run both repositories'
verification suites. Never replace a failing fixture merely to make a test
pass.
