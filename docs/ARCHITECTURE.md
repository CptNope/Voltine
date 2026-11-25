# Architecture

How Voltline is put together, and how to extend it. Read this before changing anything in `js/`.

## Principles

- **No build step, no dependencies.** The repo is what ships. Opening `index.html` from disk must keep working.
- **Classic scripts in one shared global scope.** The ten files in `js/` are plain `<script src>` tags, not ES modules, because modules don't load from `file://`. A top-level `const`, `let` or `function` in one file is visible to every file loaded after it.
- **Everything is drawn and synthesized in code.** No images, sprite sheets or audio files. Shapes are canvas paths. Sounds and music are Web Audio oscillators and filtered noise.
- **Fixed 60 Hz simulation.** Game logic runs in whole frames, so physics and timings behave the same on every machine.

## Load order

Defined by the `<script>` tags at the bottom of `index.html`:

| # | File | Defines | Runs immediately |
|---|---|---|---|
| 1 | `core.js` | canvas, `VW` `VH` `TS` `H` `G`, colours, `WPN`, `WEAK`, `STAGES` (0–4), `RUSH`, `BN`, `coreOpen` | sizes the canvas |
| 2 | `world.js` | `save` and options, `buildMap`, `tile` / `solid`, `moveX` / `moveY` / `phys`, `hit` | loads `localStorage`, wires the option buttons |
| 3 | `input.js` | `K` (held keys), `prev`, `pr()` (pressed this frame), key map, touch pad, screen pointer handler | attaches listeners |
| 4 | `audio.js` | `snd()`, music tracks `TR`, `setTrack`, `musicTick`, `pollPad` | nothing |
| 5 | `entities.js` | run state (`state`, `P`, `E`, `PB`, `EB`, …), `resetRun`, player update, `updWorld`, enemies | `buildMap(); resetRun(true)` |
| 6 | `bosses.js` | `spawnBoss`, `hitBoss`, `updBoss`, one update function per boss, `winStage` | nothing |
| 7 | `step.js` | `updShots`, `updParts`, `startStage`, `step()` | nothing |
| 8 | `render.js` | every `draw*` function, `draw()`, `frame()` | nothing |
| 9 | `editor.js` | `ED`, `TOOLS`, `CUSTOM` stage (index 5), editor input, level codes | loads the saved editor level, pushes `CUSTOM` onto `STAGES` |
| 10 | `main.js` | none | starts `requestAnimationFrame(frame)` and registers the service worker |

**Rules that keep this safe:**

- Code that runs **at load time** may only use names from the same file or an earlier one. Functions can reference later files freely, because they only run once the loop starts.
- The loop starts in `main.js`, the last file, so `step()` and `draw()` never run before everything is defined.
- Don't give a global a name the browser already uses on `window` (`name`, `status`, `top`, `parent`, `length`, `close`, `stop`, `open`, `print` and so on).

## The frame

```
frame(now)                                  render.js, driven by requestAnimationFrame
 ├─ while enough time has built up: step()  fixed 1/60 s steps, catches up after a slow frame (capped at 100 ms)
 ├─ draw()                                  once per display frame
 └─ musicTick()                             schedules about 120 ms of music ahead
```

`step()` in `step.js` handles one frame of the game:

1. `pollPad()` merges gamepad buttons into `K`, then the music and sound toggles are checked.
2. The current `state` is handled (see below).
3. The camera eases toward its target. In a boss arena it locks to the arena.
4. Particles and popups are updated, screen shake decays.
5. `setTrack()` picks the music for the current state.
6. `prev` is copied from `K`, so `pr(k)` means "pressed this frame".

## States

`state` is one string:

| State | Meaning | Leaves to |
|---|---|---|
| `title` | logo and difficulty choice | `select` |
| `select` | stage cards, Boss Rush, Level Editor | `play`, `edit`, `title` |
| `play` | gameplay | `pause`, `dead`, `got`, `edit` (custom levels) |
| `pause` | pause menu (`PAUSE_ITEMS`, cursor `pm`) | `play`, `opts`, `select`, `edit` |
| `opts` | settings (`OPT_ITEMS`, cursor `om`); returns to `optsFrom` | `title`, `select` or `pause` |
| `dead` | 90-frame "Signal lost", then `resetRun(false)` at the checkpoint | `play` |
| `got` | stage clear, weapon earned, ending or rush result | `select` or `edit` |
| `edit` | level editor | `play` (playtest), `select` |

## World and physics

- **Screen:** 480 × 272 logical pixels, scaled to the device pixel ratio by `fit()`. Strokes stay sharp at any size.
- **Tiles:** 16 px. Every map is 17 rows tall; row 15 is the usual ground line and row 16 is solid fill.
- **Map:** `map[y][x]` holds single characters. Each stage's `build(f)` fills it with `f(x0, x1, y0, y1, char)`.

| Char | Tile | Solid |
|---|---|---|
| `#` | block | yes |
| `>` / `<` | conveyor belt pushing right / left (0.8 px per frame) | yes |
| `^` | spikes or lava; kills on touch unless you're invulnerable | no |
| `H` | ladder; its top tile is a one-way platform | no |
| ` ` | empty | no |

- **Collision:** `moveX` then `moveY` against tiles, axis by axis (`world.js`). `phys(p)` adds riding moving platforms and being pushed by belts.
- **Player numbers:** 12 × 22 hitbox (12 × 12 while sliding). Run 1.6 px per frame, jump −5.2, gravity 0.25 per frame, top falling speed 6. A full jump rises about **54 px (3.4 tiles)** and covers about **66 px** of flat ground. Releasing jump early cuts the rise. Sliding is 3.2 px per frame for 26 frames and continues while there's a ceiling overhead.
- **Level design rules of thumb** (`tools/ghost.js` catches breaks in practice): no step-up taller than 3 tiles (48 px), no flat gap or spike run wider than 2 tiles unless there's a platform, and any platform over a hazard must be reachable from below without hitting your head on it.

## Stage data

Each entry in `STAGES` (`core.js`):

```js
{
  name, boss, kind,          // card label, boss name, boss key: 'warden' | 'hound' | 'kite' | 'null'
  W,                         // width in tiles; the last 31 columns are the boss arena
  cps: [2, 76, 152],         // checkpoint columns; the first one is the start
  th: { edge, fill, sky:[3 colours], r1, r2, spike:'tri'|'lava'|'barb', deco:'planet'|'stacks'|'clouds'|'core' },
  build(f) { … },            // paints the map
  spawns: [['w', x, y], …],  // w walker, f flyer, t turret, p health, e energy (tile coordinates)
  movers: [[x, y, ax, ay, period, phase], …], // moving platforms: sideways ax or up-down ay in px
  crushers: [[x, phase], …], // 160-frame cycle: rest, shake, slam, hold, rise
  wind, final, rush, custom, key  // optional flags; key picks the music track
}
```

The arena gate is column `W − 31`. Crossing column `W − 28` closes it, locks the camera and calls `spawnBoss()`.

## Entities

All entities are plain objects in arrays, updated and drawn every frame:

| Array | Contents | Updated in |
|---|---|---|
| `P` | the player | `entities.js` `updPlayer` |
| `E` | walkers, flyers, turrets; only updated when within about 40 px of the screen | `entities.js` `updEnemies` |
| `PB` | player shots. `k` = `b` buster, `B` charged, `p` prism, `a` arc, `o` gust orb. `w` = weapon index for weakness checks | `step.js` `updShots` |
| `EB` | enemy and boss bullets (`sp` = ground spark) | `step.js` |
| `PU` | pickups (`en` = energy) | `step.js` |
| `MV`, `CR`, `WARN` | moving platforms, crushers, lightning warnings | `entities.js` `updWorld` |
| `PT`, `POP` | particles and floating text | `step.js` |

## Bosses

`B` holds the current boss: `{ kind, x, y, w, h, hp, st, t, inv, … }`. `st` is the state name and `t` counts frames spent in it.

- `updBoss()` handles the parts every boss shares: the hit-flash timer, the health bar filling up on entry, the explosion sequence, the drop-in and intro.
- Each boss has its own function: `updWarden`, `updHound`, `updKite`, `updNull`. They follow the same pattern: an `idle` (or `cruise` / `float`) state that picks a random attack after a delay, attack states that run on `t`, then back to idle. Below 14 health the delays shorten and the attacks get bigger.
- `hitBoss(shot)` applies damage. A weakness hit (`WEAK[kind] === shot.w`) does 4 damage and gives 24 frames of invulnerability. A normal hit gives 10 (16 for the Null Engine).
- In Boss Rush, `RUSH[rushIdx]` replaces the stage's boss, and `rushWait` counts down between bosses.

## Rendering

`render.js` draws in this order: background (`drawBG`) → tiles, belts, spikes, ladders, checkpoints, platforms, crushers (`drawTiles`) → enemies and pickups → boss → hero → shots and particles → HUD → overlays for pause, death and results. Everything is stroked paths with `shadowBlur` for glow. **Keep background layers dim and unlit** so terrain always reads as the brightest thing on screen; the 0.8 visual pass fixed exactly this.

## Audio

- `snd(freq, dur, type, freq2, vol)` plays a one-off effect. It respects the sound toggle.
- Music: each track in `TR` has a `bpm`, a `root` MIDI note, a lead pattern `L` (32-step multiples), a bass pattern `B` (16), and drums `D` (`k` kick, `s` snare, `h` hat). Notes are semitones from the root, and `.` is a rest. `musicTick()` schedules notes on the audio clock, so timing doesn't depend on frame rate.
- Browsers only allow audio after the player interacts with the page, so `audio()` is called from input handlers.

## Settings

`OPT` (`world.js`) holds the player settings: `mv` and `sv` volumes (0–10), `shake`, `rf` (reduced flashing), `tc` (toggle charge) and `as` (assist: 0 off, 1 half damage, 2 invincible). They're saved in `voltline-opts`. Code that flashes, shakes or spawns particles should check `OPT.rf` and `OPT.shake`. Anything that records a result should skip it when `OPT.as` is on.

## Saving

See the storage table in the README. `save.cleared[i]` unlocks weapon `i + 1`. `coreOpen()` checks the first three stages. Option and progress writes are wrapped in try/catch, because storage can be unavailable (private browsing, sandboxed frames).

## How to…

### Add a stage
1. Add an entry to `STAGES` in `core.js` **before** the Boss Rush entry, then update the hard-coded stage indexes. Currently: select-screen layout (`drawSelect`, the pointer handler in `input.js`), `coreOpen`, the `key` list, and `save.cleared` / `best` / `bestH` lengths in `world.js`.
2. Give it a music track in `TR` (`audio.js`) under its `key`.
3. Run `node tools/ghost.js <index>` until it passes, then `node tools/smoke.js`.

### Add an enemy type
1. Choose a single-letter code and handle it in `spawnAll` (`entities.js`: health and size), `updEnemies` (behaviour) and `drawEnemies` (`render.js`).
2. For editor support, add it to `TOOLS`, `edCell` and `validLevel` (`editor.js`), and to the allowed type list in [LEVEL_CODES.md](LEVEL_CODES.md).

### Add a boss
1. Choose a `kind`. Add its size and start position in `spawnBoss`, an update function (dispatch it from `updBoss`), a draw function (dispatch it from `drawBoss`), and a name in `BN`.
2. Add an entry to `WEAK` if it has a weakness, and a portrait size in `portrait()`.
3. Add it to `RUSH` if it should appear in Boss Rush. Add a smoke check that it can be beaten.

### Add a weapon
1. Add an entry to `WPN` (`core.js`): name, short label, colour, cost, description.
2. Handle firing in `fire()` (`entities.js`), movement and collision in `updShots` (`step.js`), and drawing in `drawShots` (`render.js`). Set `w` on the shot so weaknesses work.
3. Decide how it unlocks. `unlocked(w)` currently maps weapon `w` to `save.cleared[w − 1]`.

### After any change
- Bump `VERSION` in `sw.js` so installed copies update.
- Run `node tools/smoke.js` and `node tools/ghost.js`.
- Add a line to [CHANGELOG.md](../CHANGELOG.md).
