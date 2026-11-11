# The Rawan 3DVista Scripts

This folder contains two versions of three JavaScript scripts used to build The
Rawan virtual-tour interface. Each version is a complete set: use all three
scripts from the **same folder**.


## What each script does

| File | Role | Where to start editing |
|---|---|---|
| `code1.js` | Navigation: menu, scene dock, scene switching, and responsive layout. | `SECTION 1` — settings, scenes, and menu items |
| `code2.js` | Welcome page, transition into the tour, and visitor onboarding. | `SETTINGS` and `ONBOARDING` near the top |
| `code3.js` | Content panels such as About and Residences; in `copy/`, it also contains panorama cards. | `SECTION 1` — content |

Section maps at the top of each file describe the rest of that script. Search
for a section name (for example, `SECTION 1. SETTINGS`) to jump to it.

## How the scripts work together

- `code2.js` displays the landing page and onboarding experience.
- `code1.js` builds the navigation and connects menu selections to the 3DVista
  scene playlist.
- `code3.js` provides content for panels opened by the navigation script.

In the `updated/` set, menu items and scene rows are configured in
`updated/code1.js`; panel content is configured in `updated/code3.js`. To show
an About or Residences panel, the corresponding menu item in `code1.js` must
refer to the panel key (`overview` or `units`). The `copy/` set has its own
menu and panel configuration; consult its script comments before changing it.

## Common edits

### Change scenes or menu items

Edit the `SCENES` and `MENU` arrays near the top of `code1.js`. Scene indexes are
zero-based positions in the 3DVista main playlist, so index `0` is the first
scene. Keep menu references and playlist order aligned. In `updated/`, nested
menu items can open additional layers.

### Change landing-page text or images

Edit `SETTINGS` and `ONBOARDING` near the top of `code2.js`. Update image and
logo URLs there as needed.

### Change panel content

Edit `CONTENT` near the top of `code3.js` to update text, image URLs, residence
details, and inquiry links. In `copy/code3.js`, panorama-card data is also under
`CONTENT`; keep its playlist indexes consistent with `copy/code1.js`.

### Change appearance

Use the styles section in the relevant script. In `updated/code3.js`, shared
colors and fonts come from the styles in `updated/code1.js`.

## 3DVista editing notes

The scripts are designed to be injected by 3DVista as escaped JavaScript.
Preserve the rules documented in each file:

- Do not add backslashes.
- End every JavaScript statement with a semicolon.
- Use `/* ... */` comments, not `//` comments.

Before publishing, check that:

1. All three scripts come from the same folder.
2. Scene indexes match the 3DVista playlist.
3. Every panel key used by the menu has matching content in `code3.js`.
4. Image and logo URLs are reachable, and placeholder residence details have
   been replaced if needed.
5. The tour works on desktop and phone layouts.
