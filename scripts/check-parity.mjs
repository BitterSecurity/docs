#!/usr/bin/env node
// EN <-> KO parity check for the Mintlify docs.
//
// Checks, relative to the repo root (or the dir given as argv[2]):
//   1. Page files: every en/**/*.mdx has a ko/**/*.mdx twin at the same relative path, and vice versa.
//   2. docs.json nav: every page listed under the "en" language has a matching "ko" entry, and vice versa.
//   3. Nav <-> files: every nav entry resolves to an existing .mdx/.md file, and every page file is in the nav.
//
// Exits 1 and lists every mismatch if anything is out of sync; exits 0 otherwise.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.argv[2] ?? process.cwd();
const LANGS = ["en", "ko"];
const PAGE_EXT = /\.(mdx|md)$/;

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (PAGE_EXT.test(name)) out.push(p);
  }
  return out;
}

// "en/foo/bar.mdx" -> "foo/bar"
const filePages = {};
for (const lang of LANGS) {
  filePages[lang] = new Set(
    walk(join(root, lang)).map((p) =>
      relative(join(root, lang), p).split(sep).join("/").replace(PAGE_EXT, ""),
    ),
  );
}

// Collect page slugs from the docs.json navigation for each language.
function collectPages(node, acc) {
  if (typeof node === "string") acc.push(node);
  else if (Array.isArray(node)) node.forEach((n) => collectPages(n, acc));
  else if (node && typeof node === "object") {
    for (const key of ["pages", "groups", "tabs", "anchors", "dropdowns", "versions", "menu"]) {
      if (node[key]) collectPages(node[key], acc);
    }
  }
  return acc;
}

const docs = JSON.parse(readFileSync(join(root, "docs.json"), "utf8"));
const navLangs = docs?.navigation?.languages ?? [];
const navPages = {};
for (const lang of LANGS) {
  const entry = navLangs.find((l) => l.language === lang);
  navPages[lang] = new Set(
    entry ? collectPages(entry, []).map((p) => p.replace(new RegExp(`^/?${lang}/`), "")) : [],
  );
  if (!entry) navPages[lang].missingLanguage = true;
}

const problems = [];
const diff = (a, b) => [...a].filter((x) => !b.has(x)).sort();

for (const lang of LANGS) if (navPages[lang].missingLanguage) problems.push(`docs.json: no navigation.languages entry for "${lang}"`);

const [A, B] = LANGS;
for (const [x, y] of [[A, B], [B, A]]) {
  for (const p of diff(filePages[x], filePages[y])) problems.push(`file: ${x}/${p} exists but ${y}/${p} is missing`);
  for (const p of diff(navPages[x], navPages[y])) problems.push(`nav:  ${x}/${p} is in docs.json but ${y}/${p} is not`);
}
for (const lang of LANGS) {
  for (const p of diff(navPages[lang], filePages[lang])) problems.push(`nav->file: ${lang}/${p} is in docs.json but has no .mdx/.md file`);
  for (const p of diff(filePages[lang], navPages[lang])) problems.push(`file->nav: ${lang}/${p} exists but is not in docs.json navigation`);
}

const counts = LANGS.map((l) => `${l}: ${filePages[l].size} files / ${navPages[l].size} nav`).join(", ");
if (problems.length) {
  console.error(`parity: FAILED (${counts})`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`parity: OK (${counts})`);
