# Voltline roadmap

Where the game is going, in what order, and how we'll know each step is finished. When something ships, tick it off here, move its milestone to **Done**, and add an entry to [CHANGELOG.md](CHANGELOG.md).

**Current version: 0.17.1.** (0.14 still needs its human playtest round.) Licensed under MIT. Everything shipped so far is covered by `tools/smoke.js` and `tools/ghost.js`, but **no real person has play-tested it yet**. That gap is why the next milestone is about playtesting and game feel, not new content.

**How to read this:**
- **Size:** **S** is an afternoon, **M** a day or two, **L** most of a week.
- **Done when:** the check that closes an item. If an item has no clear check, it isn't ready to schedule.
- Milestones are in order. Items inside a milestone are in rough priority order.

---

## Contents

- [Vision and pillars](#vision-and-pillars)
- [Where we are](#where-we-are)
- [Decisions](#decisions)
- [Milestones](#milestones): [0.14 Feel](#014--feel-and-first-playtest) · [0.15 Access](#015--access-for-everyone) · [0.16 Community](#016--community-levels) · [0.17 Sectors](#017--new-sectors) · [0.18 Modes](#018--modes-and-replays) · [0.19 Presentation](#019--presentation) · [1.0 Release](#10--release)
- [Engineering track](#engineering-track)
- [Beyond 1.0](#beyond-10)
- [Ideas parking lot](#ideas-parking-lot)
- [Known issues](#known-issues)
- [Done](#done)

---

## Vision and pillars

**Voltline is a tight, fair, vector-drawn action platformer that you open in a browser and are playing within seconds, with tools that let players make their own stages.**

Every feature should support at least one of these pillars and break none of them:

1. **Readable at a glance.** Glowing strokes, terrain that's always the brightest thing on screen, and warnings before every attack. If a player dies without knowing why, that's a bug.
2. **Fair and tight controls.** Fixed 60 Hz physics, generous input handling, and every jump proven possible by the route checker.
3. **Zero install, zero build.** One URL, offline after the first visit, plain scripts anyone can read. No accounts, no tracking, no build step.
4. **Players make things.** The editor, level codes and route check are first-class features, not extras.
5. **Accessible by default.** Settings for motion, flashing, difficulty and input are part of the game, not a later patch.

## Where we are

| | Now (0.13) | Target for 1.0 |
|---|---|---|
| Sectors | 7 (adds Orbit Deck and Phase Lab in 0.17) | 7 |
| Bosses | 7, plus 6 mid-bosses | 7, plus a mid-boss in each sector |
| Boss weapons | 6, plus the Volt Buster | 6 |
| Enemy types | 11 (adds asteroid, UFO, blink drone, phase mine) | 11 to 13 |
| Music tracks | 8 | 10, plus a phase-2 layer for each boss |
| Achievements | 16 | about 25 |
| Modes | Story, Hard, Boss Rush, Editor | adds Challenge rooms, Practice and Ghost replays |
| Automated checks | 60 smoke checks, plus a route check on every stage | adds browser screenshot tests and a performance budget |
| Gallery levels | 10 | 25 or more, including community levels |
| Human playtesters | 0 | at least 5, including one gamepad player and one phone player |

## Decisions

### Made

| Decision | Outcome | When |
|---|---|---|
| License | **MIT**. See [LICENSE](LICENSE). | 0.13 |
| Repo name | Renamed `Voltine` → **`Voltline`**. The game is now at `cptnope.github.io/Voltline/`; the old Pages address no longer works. | 0.14 |
| Build tooling | No build step. Classic scripts, not ES modules, so `file://` keeps working. | 0.8 |
| New stages | Added to the end of `STAGES`, so older saves keep their indexes. The select-screen order lives in `CARD`. | 0.12 |
| Weakness design | One closed cycle through the wardens. The final boss takes +1 from every boss weapon. | 0.12 |
| Level design guard | Every built-in stage must pass `tools/ghost.js` before merging. | 0.9 |

### Open

| Decision | Options | Recommendation | Blocks |
|---|---|---|---|
| **Fonts offline** | keep Google Fonts, or bundle Chakra Petch (it's under the OFL) | **Bundle it.** It removes the only third-party request and makes a fresh offline install pixel-exact. | 0.19 |
| **Where to release** | GitHub Pages only, itch.io too, or a desktop build (Steam) | **itch.io at 1.0.** It costs nothing and accepts browser games. Decide on desktop after seeing how people respond. | 1.0 and Beyond |
| **Privacy stance** | no data collected ever, or opt-in anonymous stats | **No data collected.** It fits pillar 3. Playtest feedback comes from people, not telemetry. | Engineering track |
| **Story framing** | none, light (intro and ending cards), or full cutscenes | **Light.** A few vector title cards that frame the wardens without slowing the game down. | 0.19 |

---

## Milestones

### 0.14 · Feel and first playtest

*Goal: the game feels great in the hands, and real people have played it.*

| Item | Size | Done when |
|---|---|---|
| ✅ **Coyote time:** jump for a few frames after walking off a ledge | S | A jump up to 6 frames after leaving a ledge works; smoke check added |
| ✅ **Jump buffering:** a jump pressed just before landing still happens | S | A press up to 6 frames before landing jumps; smoke check added |
| ✅ **Hit-stop and feedback:** a brief freeze on boss hits and kills, punchier hit sounds | S | 3-frame freeze on boss hits; respects reduced flashing |
| ✅ **Camera:** eases its lead in the direction you're facing instead of snapping when you turn | S | No sudden camera snaps when turning |
| **Playtest round 1:** 5 people, covering keyboard, gamepad and phone. The kit is ready: [docs/PLAYTEST.md](docs/PLAYTEST.md) plus the in-game playtest report. | M | Notes recorded in `docs/PLAYTEST.md`: where people died, what felt unfair, what dragged, completion times |
| **Tuning pass** from those notes | M | Every "unfair" note has a change or a written reason for keeping it |
| Undertow, Gale Kite and Null Engine phase 1 timing checks | S | Each fight lasts 45 to 120 s for a playtester using its weakness weapon |
| Music and sound mix pass | S | No track or effect clips; the boss themes sit slightly above the stage themes |
| Real-device checks: install, offline play, touch editing on Android Chrome and iOS Safari | S | Checklist in `docs/PLAYTEST.md` all passing |

### 0.15 · Access for everyone

*Goal: anyone can play it, whatever their input device, eyesight or reaction speed.*

| Item | Size | Done when |
|---|---|---|
| ✅ **Remappable keys** and gamepad buttons in Settings | M | Every action can be rebound, conflicts are flagged, and bindings save |
| ✅ **High-contrast palette:** terrain, hazards, enemies and shots in maximum-separation colours | M | Checked with a colour-blindness simulator for deuteranopia, protanopia and tritanopia |
| ✅ **Shapes, not just colours:** each weapon and hazard is distinguishable by shape | S | Screenshot review in grayscale |
| ✅ **Large text:** larger HUD and menu text | S | Shipped as one Large step (about 1.2×, minimum 10 px), with long labels shrinking to fit. A 150% step needs a menu re-layout and is listed under Next. |
| ✅ **Slow mode:** game speed at 75% or 50% (counts as assist) | S | Physics stay deterministic; no best times recorded |
| ✅ **One-handed options:** auto-fire and hold-to-swim (verifying a full single-hand clear waits for a playtester) | S | Every stage can be cleared with a single-hand layout |
| ✅ **Hard-mode splits** on the Records screen | S | Times page shows Normal and Hard splits |
| ✅ **Accessibility statement** in the README | S | Lists every option and any known gaps |

**Follow-ups from 0.15:** a 150% text size with re-laid-out menus; a playtest with at least one player who uses remapping or high contrast.

### 0.16 · Community levels

*Goal: sharing and finding levels is easy and safe.*

| Item | Size | Done when |
|---|---|---|
| ✅ **Route check before sharing:** Copy code runs it first and marks codes that passed | S | Codes carry a "verified" flag that gets re-checked on load |
| ✅ **Play links:** `?level=VL1…` opens straight into a level on the Pages site | S | The link works on Pages and fails gracefully elsewhere |
| ✅ **Level names and authors** in codes | S | Shown on the playtest card; length and characters filtered |
| ✅ **Editor undo and redo** (region copy and paste moved to Next) | M | Ctrl/Cmd+Z and Y work, with a 50-step history |
| ✅ **Longer levels:** up to 200 columns, with a resize control | M | Old 100-column codes still load |
| ✅ **Checkpoint safety:** block checkpoints over pits | S | The editor refuses them with a message |
| ✅ **Level gallery:** a curated `levels.json` in the repo, browsable from a Gallery screen | M | At least 10 levels, each passing the route check in CI |
| ✅ **Levels by pull request:** a documented way to add a gallery level | S | `CONTRIBUTING.md` section, with CI validating every entry |

**Follow-ups from 0.17:** a weakness chart on the Records screen; gallery levels that use the new themes.

**Follow-ups from 0.16:** selecting, copying and pasting a region in the editor; gallery levels from the community; showing the gallery level's boss and theme as a small preview.

### 0.17 · New sectors

*Goal: two more sectors with mechanics the game doesn't have yet, bringing it to seven.*

| Item | Size | Done when |
|---|---|---|
| ✅ **Sector briefs:** pick two concepts from the shortlist and write a one-page brief for each | S | Each covers the mechanic, three stage beats, the boss, the weapon and its place in the weakness cycle |
| ✅ Sector A, **Orbit Deck**: stage, Orbiter boss, Orbit Disc, music, background | L | Passes `ghost.js`; boss beatable in smoke tests; documented |
| ✅ Sector B, **Phase Lab**: Mirror boss, Echo Shot, music, background | L | Same as Sector A |
| ✅ **Extend the weakness cycle to six wardens** | S | One closed loop (done); the Records weakness chart is still to do |
| ✅ **Mid-bosses:** one halfway through each sector (0.17.1; the Null Core has none) | M | Each has a health bar and a checkpoint after it |
| ✅ **New enemies:** two per new sector (asteroid, UFO, blink drone, phase mine) | M | Each is in the editor and allowed in level codes |

**Sector shortlist:**

| Concept | Mechanic | Boss idea |
|---|---|---|
| **Orbit Deck** | low-gravity zones and floaty long jumps | a rotating satellite that sweeps the arena with lasers |
| **Phase Lab** | blocks that switch on and off with the music's beat | a mirror warden that copies your current weapon |
| **Mag Rail** | magnetic ceilings that flip gravity | a train that crosses the arena on rails |
| **Ember Stack** | rising lava you have to climb away from | a heat drake that leaves fire on the floor |
| **Glitch Archive** | rooms that rearrange themselves, corrupted tiles | a boss built from the level's own tiles |

### 0.18 · Modes and replays

*Goal: reasons to keep playing after the credits.*

| Item | Size | Done when |
|---|---|---|
| **Seeded randomness:** every run is reproducible from a seed | M | The same seed and inputs always give the same result; smoke check compares two runs |
| **Ghost replays:** race a translucent copy of your best run | M | Inputs recorded per frame; best run saved per sector and replayed alongside you |
| **Challenge rooms:** 20 short rooms with bronze, silver and gold times | L | Every room passes the route check; medals save with progress |
| **Practice mode:** start any cleared sector from any checkpoint, or refight any beaten boss | S | Reached from Records; no best times recorded |
| **Daily run:** a seeded set of rooms that's the same for everyone that day | M | Works offline (the seed comes from the date); local best only |
| **Endless climb:** rooms stitched from hand-made chunks | L | Every chunk passes the route check; difficulty ramps; best height saved |

### 0.19 · Presentation

*Goal: the game looks and sounds finished.*

| Item | Size | Done when |
|---|---|---|
| **Light story framing:** intro, warden title cards, ending | M | Under 30 s in total and skippable |
| **Boss intro cards:** name, vector portrait, one line of flavour | S | Shown once per fight; skippable |
| **Music variations:** a second loop for each stage and a phase-2 layer for each boss | M | Switches without a gap |
| **Death and respawn feedback:** a clearer reboot animation and a checkpoint flash | S | Respects reduced flashing |
| **Bundled font**, if that decision goes that way | S | No third-party requests at all |
| **Background variety:** a second parallax layer per sector | M | Terrain is still the brightest layer in screenshots |
| **Title screen attract mode:** a looping gameplay demo | S | Starts after 20 s without input |
| **Icon redraw** inside the maskable safe zone | S | No cropping on Android launchers |

### 1.0 · Release

*Goal: ready to put in front of strangers.*

**Done when:**
- [ ] At least 5 playtesters have finished the story, and every high-severity note is resolved
- [ ] Every stage passes the route check; every boss passes the smoke tests on Normal and Hard
- [ ] Holds 60 fps on a mid-range phone (Pixel 6a class) in the busiest boss fight
- [ ] Accessibility checklist from 0.15 complete
- [ ] No high-severity known issues
- [ ] README, ARCHITECTURE, LEVEL_CODES, CONTRIBUTING and CHANGELOG up to date
- [x] Repo-name decision made, with links updated (0.14)
- [ ] itch.io page: description, 5 screenshots, a 30-second GIF, controls
- [ ] Press kit in `docs/press/`: logo, screenshots, fact sheet
- [ ] Git tag `v1.0.0` and a GitHub Release with notes

---

## Engineering track

Runs alongside the milestones. Pick items up when they unblock something or when the code starts fighting back.

| Item | Size | Why |
|---|---|---|
| **Automatic `sw.js` version:** CI fails if game files changed without a version bump, or a script stamps it | S | A missed bump leaves installed players on stale files |
| **Browser screenshot tests in CI:** Playwright captures title, select, each stage and each boss | M | Catches visual regressions; manual screenshots found real bugs in 0.8, 0.11, 0.12 and 0.13 |
| **Performance budget:** CI checks that each frame's step and draw stay under a time limit | M | Protects phone performance as content grows |
| **Save format version:** a `v` field and step-by-step migrations | S | The 0.13 crash came from saves of different shapes |
| **Split `render.js`:** HUD and menus into their own file | S | It's the biggest file and it changes every round |
| **Syntax check in CI:** `node --check` on every script | S | Fails fast before the slower checks run |
| **Release tags:** tag every version and publish GitHub Releases from the changelog | S | Gives players and contributors a stable reference |
| **Error card:** catch script errors and show a friendly "something broke" card with Copy details | S | Players can report crashes without opening dev tools; nothing is sent anywhere |

## Beyond 1.0

- **Desktop build** (a Tauri or Electron wrapper) and possibly Steam, if people respond well on itch.io
- **Two-player co-op** on one keyboard or with two gamepads
- **Localization** of the UI text, starting with Spanish and Portuguese
- **Community speedrun board:** times submitted through GitHub pull requests and verified by replaying the run with the ghost-replay system, so no server is needed
- **Controller vibration** on hits and explosions, where browsers support it
- **Stage packs:** load custom multi-level packs from a JSON file

## Ideas parking lot

Unscheduled. Promote an idea to a milestone when there's a reason.

- Photo mode, or a GIF export of boss kills (canvas `captureStream`)
- A frame-accurate speedrun timer overlay
- New Game+ with remixed enemy placement
- Weapon combos (for example, a charged Tide Lance that briefly freezes water)
- Hidden collectibles in each sector that unlock concept-art cards on the Records screen
- An editor theme painter for mixing backgrounds and palettes
- A built-in music sequencer so level makers can pick or tweak a track
- Seasonal palettes (a winter variant of each sector)

## Known issues

| Issue | Severity | Planned |
|---|---|---|
| Not play-tested by people | high | 0.14 |
| Font falls back to monospace until Google Fonts loads | low | 0.19, if the font gets bundled |
| `sw.js` `VERSION` has to be bumped by hand | low | Engineering track |
| Maskable icon art comes close to the safe-zone edge | cosmetic | 0.19 |

## Done

| Version | Highlights |
|---|---|
| 0.17.1 | Six mid-bosses, each in a walled section after the middle checkpoint; two new achievements |
| 0.17 | Orbit Deck and Phase Lab sectors (Orbiter, Mirror, Orbit Disc, Echo Shot, four new enemies, low gravity, phase blocks), six-warden weakness loop, two-row stage select, seven-boss Rush |
| 0.16 | Level gallery (10 route-checked levels, checked in CI), play links, verified codes, names and authors, undo/redo, levels up to 200 columns, checkpoint safety |
| 0.15 | Remappable keys and buttons, high-contrast palette (colour-blind simulated), large text, game speed, auto-fire, hold to swim, Hard splits, accessibility statement |
| 0.14 | Repo renamed to Voltline; coyote time, jump buffering, hit-stop, camera easing, playtest log and kit |
| 0.13 | Achievements, checkpoint splits, Records screen, lifetime stats, progress codes; MIT license |
| 0.12 | Tide Vault sector with swimming, Undertow boss, Tide Lance, jellyfish, four-link weakness cycle |
| 0.11 | Shield walker, spark hopper and gull enemies; in-editor route check |
| 0.10 | Pause menu, settings (volumes, shake, reduced flashing, toggle charge, assist), stage intro cards, Gale Kite rebalance |
| 0.9 | Route checker and smoke tests in `tools/`; fixed four impossible or near-impossible jumps it found; full documentation |
| 0.8 | Code split into ordered script files; visual fixes from real-browser screenshots (background contrast, phone layout, select portraits) |
| 0.7 | Level editor with playtest, autosave and shareable level codes |
| 0.6 | Boss Rush; installable PWA with offline support |
| 0.5 | Soundtrack, Hard mode, gamepad support, music and sound toggles |
| 0.4 | Null Core fortress and the two-phase Null Engine |
| 0.3 | Stage select, Coil Foundry, Sky Relay, three boss weapons with a weakness cycle |
| 0.2 | Moved into this repo |
| 0.1 | First playable: one stage, the Prism Warden, run / jump / slide / climb / charge shot |
