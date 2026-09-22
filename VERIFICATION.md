# Verification record

Last updated: 2026-09-22.

The current `0.1.0` workspace was checked with:

- formatting, ESLint, and strict TypeScript checks;
- 11 unit/component tests covering strict input, semantic references,
  localization, exact geometry boundaries, UI state, and preferences;
- production package and demo builds;
- shadcn registry generation for Base UI and Radix UI variants;
- npm tarball path allowlisting and gzip budgets;
- clean tarball imports in React 18.3.1 and React 19.1.1 consumers;
- `npm audit` with no reported vulnerabilities;
- Chromium desktop/mobile and Firefox browser flows;
- desktop/mobile screenshots compared with the approved visual reference.

The local WebKit run did not start because this workstation lacks WebKit's
native ICU, media, XML, and text-layout libraries. This is missing runtime
tooling, not a failed specification or viewer assertion. The CI browser job
uses `playwright install --with-deps` before running Chromium, Firefox, and
WebKit.

These checks do not certify physical foldability, collision behavior,
screen-reader support, or complete Fold Spec conformance.
