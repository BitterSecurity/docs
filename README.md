# Decepticon Docs

Source for the Decepticon documentation by Bitter Security, built with [Mintlify](https://mintlify.com).
Site config and navigation live in `docs.json`; pages are MDX under `en/` and `ko/` (kept 1:1).

## Preview locally

```bash
npx mintlify@latest dev
```

## Running checks

CI runs **locally** (we don't use paid GitHub Actions minutes), so run this before opening a PR:

```bash
scripts/ci.sh
```

It runs, in order:

| Step | Command | Fails when |
|---|---|---|
| Build validation | `npx mintlify validate` | `docs.json` / MDX doesn't build |
| Link check | `npx mintlify broken-links` | any internal link points at a missing page |
| EN/KO parity | `node scripts/check-parity.mjs` | a page exists in one language but not the other, a `docs.json` nav entry has no twin in the other language, a nav entry has no file, or a page file isn't in the nav |

Logs go to `/workspace/out/local-ci-<short-sha>/` (`validate.log`, `broken-links.log`, `parity.log`, `summary.txt`);
override with `CI_OUT_ROOT=/some/dir`. The mintlify CLI version is pinned in the script; override with `MINTLIFY_VERSION=latest`.
Requires Node 20+.

When you add a page, add both `en/<path>.mdx` and `ko/<path>.mdx` and list both in `docs.json`.

`.github/workflows/docs-ci.yml` (optional) runs the same script on pull requests if Actions is ever enabled.
