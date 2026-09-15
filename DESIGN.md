# Decepticon Documentation Brand System

Status: implementation source of truth
Brand source: `/home/catow/GIT/bitter-security/DESIGN.md`

## 1. Brand relationship

- Bitter Security is the company brand; Decepticon is its offensive security platform.
- The site title is `Decepticon by Bitter Security` so product context remains clear while the previous company identity is no longer public-facing.
- GitHub repository links use the renamed `BitterSecurity` organization.

## 2. Identity assets

- Header, light mode: `/logos/bitter-security-lockup-on-light.svg`.
- Header, dark mode: `/logos/bitter-security-lockup-on-dark.svg`.
- Browser icon: `/logos/bitter-security-favicon.svg`, using the all-path Coupled Field symbol on Carbon.
- Header lockups and the browser icon use the all-path masters from the Bitter Security logo system. They must not be replaced with the legacy raster logo or with bitmap-scaled Bitter Security artwork.
- The logo keeps its native `138:64` aspect ratio and renders at `48px` high in the Mintlify navigation so the descriptor remains legible without exceeding the header.

## 3. Color tokens

| Token | Value | Documentation role |
|---|---|---|
| Oxide | `#B82C3D` | Primary emphasis in light mode |
| Oxide bright | `#F06A76` | Accessible emphasis in dark mode |
| Oxide ink | `#8B1828` | Buttons and hover states |
| Chalk | `#F1F0EA` | Light-mode background |
| Carbon | `#08090A` | Dark-mode background |

Oxide is the only accent. Purple, security blue, neon effects, and gradients are not part of this documentation identity.

## 4. Typography and spacing

- Geist is the documentation family for headings, navigation, and body text.
- Mintlify owns the reading scale and content measure; the rebrand does not override article typography or structural spacing.
- Korean section headings use a `20px / 28px` mobile token so compact topic-predicate phrases remain intact at 375px.
- Spacing follows the Bitter Security 4px base scale. The only custom navigation size is the `48px` logo height.

## 5. Primitives and states

- `BrandLockup`: theme-specific light and dark SVG sources; default, light-mode, dark-mode, mobile, and high-density states.
- `BrandLink`: the navbar link to `https://bittersecurity.com`; default, hover, keyboard-focus, and mobile-menu states remain Mintlify-native.
- `BrandAccent`: Mintlify controls, active navigation, links, and focus states driven only by the three Oxide configuration tokens.

## 6. Responsive and accessibility constraints

- The header lockup must remain sharp and unclipped at 375px, 768px, and 1280px widths.
- The lockup's authored title/description and Mintlify's generated logo alternative text must identify Bitter Security.
- Both color modes must preserve readable navigation, visible focus states, and the original documentation hierarchy.
- Korean navigation and article text must not clip or create single-character orphan lines at the tested breakpoints.
- Korean prose keeps words intact rather than using emergency mid-word wrapping.

## 7. Accepted design debt

None.
