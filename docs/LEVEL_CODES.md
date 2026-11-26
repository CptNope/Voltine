# Level code format (`VL1`)

Level codes are how custom levels from the editor are shared. A code is plain text that's safe to paste into a chat, an issue or a JSON file.

```
VL1.<base64 of a JSON object>
```

The `VL1.` prefix is the format version. The decoder also accepts the bare base64 without the prefix.

## JSON fields

| Key | Type | Meaning |
|---|---|---|
| `b` | string | boss: `warden`, `hound`, `kite`, `undertow`, `orbiter`, `mirror` or `null` |
| `t` | integer 0–6 | theme: 0 Prism Grid, 1 Coil Foundry, 2 Sky Relay (adds wind), 3 Null Core, 4 Tide Vault, 5 Orbit Deck, 6 Phase Lab. This sets colours and music. |
| `r` | array of 17 strings | the tile rows, top to bottom, run-length encoded (below) |
| `s` | array of `[type, x, y]` | entities. `type` is `w` walker, `s` shield walker, `h` spark hopper, `f` flyer, `g` gull, `j` jellyfish, `a` asteroid, `u` UFO, `b` blink drone, `q` phase mine, `t` turret, `p` health, `e` energy |
| `v` | array of `[x, y, vertical]` | moving platforms. `vertical` 0 moves sideways (±40 px over 180 frames), 1 moves up and down (±28 px over 150 frames) |
| `c` | array of `x` | crusher columns |
| `k` | array of `x` | checkpoint columns (up to 3; the start is always column 2) |
| `w` | integer 100–200 | *optional:* width in columns (default 100). Every row must decode to exactly this many tiles. |
| `n` | string | *optional:* level name, up to 32 characters of letters, numbers and `. , ' ! ? & ( ) - :` |
| `a` | string | *optional:* author, up to 24 characters, same rules as the name |
| `ok` | string | *optional:* the route-verified mark (see below) |

All coordinates are tile columns (`x`, 0 to width − 1) and rows (`y`, 0–16).

## Tile rows

Each row is `w` tiles (100 unless `w` says otherwise), written as `<count><char>` pairs, with each count between 1 and 99:

| Char | Tile |
|---|---|
| ` ` (space) | empty |
| `#` | block |
| `^` | spikes |
| `H` | ladder |
| `>` | belt pushing right |
| `<` | belt pushing left |
| `~` | water (swimmable) |
| `o` | low-gravity field (0.17) |
| `A` | phase block, solid on the first beat (0.17) |
| `B` | phase block, solid on the second beat (0.17) |

Example: a row with 30 empty tiles, 5 blocks and 65 empty tiles is `30 5#65 `. Tile characters are never digits, so the pairs can be read without separators.

## What the game adds and enforces

- Column 0 is always a wall. Columns 1–4 of rows 15–16 are always solid, as the start platform.
- The 31 columns after the level's width are the boss arena, added automatically: solid ground, a closing gate at column 100 and a wall at 129–130.
- When a code is loaded, it's checked. It's **rejected** if the boss, theme or row count is invalid, if the width is outside 100–200 or any row doesn't decode to exactly that many tiles, or if a tile character isn't one of the seven above.
- These are **dropped quietly**: entities with an unknown type or coordinates outside the grid; anything beyond 200 entities, 40 platforms, 30 crushers or 3 checkpoints; and name or author characters outside the allowed set; and any extra fields.
- Decoded values are only used as data. They're never inserted into the page as HTML.

## Minimal example

A flat level with one walker, fighting the Coil Hound on the Foundry theme:

```json
{"b":"hound","t":1,
 "r":["99 1 ","99 1 ","99 1 ","99 1 ","99 1 ","99 1 ","99 1 ","99 1 ","99 1 ","99 1 ","99 1 ","99 1 ","99 1 ","99 1 ","99 1 ","99#1#","99#1#"],
 "s":[["w",20,14]],"v":[],"c":[],"k":[]}
```

Base64-encode that JSON and put `VL1.` in front to get a working code.

## Versioning

If the format ever changes in a way that breaks old codes, use a new prefix (`VL2.`) and keep the `VL1` decoder, so old shared codes still load.

## Compatibility

0.12 added water (`~`), jellyfish (`j`), the Undertow boss and theme 4. All older `VL1` codes still load, but codes using these additions won't load in versions before 0.12.

## The route-verified mark

`ok` holds a short fingerprint of everything that affects whether the level can be finished: boss, theme, width, tiles, entities, platforms, crushers and checkpoints. The editor sets it when **Check route** passes. When a code is loaded, the game recomputes the fingerprint, and the level only counts as verified if the two match. Any edit after the check therefore clears the mark.

The mark is a convenience, not a guarantee: anyone can copy it into a code by hand. That's why the gallery's CI check (`tools/check-gallery.js`) re-runs the route search on every gallery level, not just checking the mark.

## Play links

A play link is the game's address with the code as the `level` query parameter, URL-encoded:

```
https://cptnope.github.io/Voltline/?level=VL1.eyJiIjoia2l0ZS...
```

Opening one shows the level's name and author on the title screen. Enter plays it without touching the player's own editor level.

0.16 added `w`, `n`, `a` and `ok`. Codes without them load exactly as before. Codes that use a width above 100 won't load in versions before 0.16.
