# Contributing

Issues and focused pull requests are welcome. Install Node.js 20.19 or newer,
run `npm install`, and use `npm run check` before submitting a change.

Viewer behavior is derived from the versioned Fold Spec contract. Changes to
parsing, motion, layers, localization, or capability claims must cite the
matching normative section and add valid/invalid or golden fixtures. Preserve
material IDs, face winding, operation order, per-side appearance, localized
text, rights, and authored limitations.

Add a changeset for user-visible package changes. Do not commit dependencies,
build output, secrets, captured third-party pages, or unlicensed binary assets.
Automated tests do not justify claims of physical validation or accessibility
certification.
