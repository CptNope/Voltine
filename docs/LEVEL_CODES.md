# Level code format (`VL1`)

Level codes are how custom levels from the editor are shared. A code is plain text that's safe to paste into a chat, an issue or a JSON file.

```
VL1.<base64 of a JSON object>
```

The `VL1.` prefix is the format version. The decoder also accepts the bare base64 without the prefix.

## JSON fields

| Key | Type | Meaning |
|---|---|---|
| `b` | string | boss: `warden`, `hound`, `kite` or `null` |
| `t` | integer 0–3 | theme: 0 Prism Grid, 1 Coil Foundry, 2 Sky Relay (adds wind), 3 Null Core. This sets colours and music. |
| `r` | array of 17 strings | the tile rows, top to bottom, run-length encoded (below) |
| `s` | array of `[type, x, y]` | entities. `type` is `w` walker, `f` flyer, `t` turret, `p` health, `e` energy |
| `v` | array of `[x, y, vertical]` | moving platforms. `vertical` 0 moves sideways (±40 px over 180 frames), 1 moves up and down (±28 px over 150 frames) |
| `c` | array of `x` | crusher columns |
| `k` | array of `x` | checkpoint columns (up to 3; the start is always column 2) |

All coordinates are tile columns (`x`, 0–99) and rows (`y`, 0–16).

## Tile rows

Each row is 100 tiles, written as `<count><char>` pairs, with each count between 1 and 99:

| Char | Tile |
|---|---|
| ` ` (space) | empty |
| `#` | block |
| `^` | spikes |
| `H` | ladder |
| `>` | belt pushing right |
| `<` | belt pushing left |

Example: a row with 30 empty tiles, 5 blocks and 65 empty tiles is `30 5#65 `. Tile characters are never digits, so the pairs can be read without separators.

## What the game adds and enforces

- Column 0 is always a wall. Columns 1–4 of rows 15–16 are always solid, as the start platform.
- Columns 100–130 are the boss arena, added automatically: solid ground, a closing gate at column 100 and a wall at 129–130.
- When a code is loaded, it's checked. It's **rejected** if the boss, theme or row count is invalid, if any row doesn't decode to exactly 100 tiles, or if a tile character isn't one of the six above.
- These are **dropped quietly**: entities with an unknown type or coordinates outside the grid; anything beyond 120 entities, 30 platforms, 20 crushers or 3 checkpoints; and any extra fields.
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
