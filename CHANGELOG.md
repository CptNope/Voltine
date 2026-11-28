# Changelog

Versions are informal milestones. Newest first.

## 0.21.1 — itch.io release

- **On itch.io:** https://cptnope.itch.io/voltline, free with donations welcome, playable in the browser.
- **Embed layout:** inside an iframe (or with `?embed`), the game screen fills the frame at 480:272, letterboxed, and the controls, editor and progress panels sit below it. On touch screens the pad floats over the bottom of the frame; in landscape, START and WPN move above FIRE and JUMP so they don't cover the middle of the screen. The page on GitHub Pages is unchanged. Offline cache bumped to v27.
- **itch.io art** in `docs/press/itch/`: cover, theme banner, page background, embed background and a launch devlog header, drawn by `tools/build-itch-art.py` from the logo and screenshots.
- Fixed: the README said 16 achievements; there are 21. The fact sheet now says version 0.21.

## 0.21 — Performance and press kit

- **Graphics setting** (Settings → Graphics): Auto, the default, caps the canvas at 2× pixel density and switches itself to Low, with a toast, if play averages under about 52 fps for 3 seconds. High allows 3×. Low uses 1.5× and turns off the glow, which is the most expensive thing the game draws.
- **Performance check:** with the CPU slowed 4× on a phone-sized screen, the game's own work is 2–3 ms a frame (95th percentile) in the busiest scenes. Drawing is the real cost: in software rendering, High ran the Null Engine fight at 30 fps and Low at 60, and Auto switched within 3 seconds. A real phone still needs checking.
- **Press kit** in `docs/press/`: a fact sheet, ready-to-paste itch.io page text, the logo (light and dark), eight screenshots, and a 30-second gameplay GIF (2.7 MB) and MP4. All of it is made from the game itself by `tools/build-press.js`, so it can be rebuilt.
- `tools/build-itch.sh` zips the game for an itch.io HTML upload (about 460 KB).
- The README's development-tools section lists every tool.
- Smoke tests: 200 checks.

## 0.20 — Endless run and playtest prep

- **Endless run:** on the Challenges screen next to the Daily run. Hand-made 16-column chunks join up as you go: 24 of them in three tiers, with tier 2 from 80 m and tier 3 from 200 m. The scenery and music change every 8 chunks. The null wave follows you, speeds up with distance, and never falls more than most of a screen behind. One life; best distance saved. The roadmap said "climb", but the camera scrolls sideways, so it's a run.
- **Every chunk is checked:** `tools/check-chunks.js` route-checks each chunk and measures its speed; CI fails if any chunk loses its route or the wave's top speed (0.75 px/frame) isn't below 90% of the slowest chunk (0.96). CI now runs five checks.
- **Playtest report:** challenge rooms, the Daily run, Endless and practice are now reported in their own sections instead of being counted as sector deaths. Mid-boss deaths and fight lengths are listed, and so are the kinds of input used and the settings that were on.
- **Flag a moment:** press F (or Pause → Flag this moment) to mark a spot for the report without stopping. The playtest guide (`docs/PLAYTEST.md`) explains it and adds tuning targets for mid-bosses, rooms and Endless.
- One achievement: **Long Haul** (300 m in Endless).
- Pause menu: Restart and Quit read correctly in rooms and Endless.
- Smoke tests: 193 checks.

## 0.19 — Presentation, part 2

- **Bundled font:** Chakra Petch now ships in `fonts/` under the SIL Open Font License, replacing Google Fonts. The game makes no third-party requests at all, and a fresh offline install looks exactly the same.
- **Music variations:** every second pass through a track adds a harmony a fourth below the lead, a soft arpeggio and off-beat hats. Below half health, every boss fight adds a pulsing low bass and a high arpeggio. Both come in on the beat with no gap.
- **Background variety:** a second, nearer parallax layer in every sector (crystal shards, foundry trusses, sunken arches, relay masts, a station frame, wireframe cubes, hanging cables), kept dim so the terrain stays the brightest layer.
- **Icon redraw:** the hero's helmet and a volt line, all inside the maskable safe zone, so Android launchers don't crop it. `tools/build-icons.js` redraws it.
- The app description no longer says "three sectors".
- Smoke tests: 177 checks.

## 0.19 — Presentation, part 1

- **Story:** four short cards before your first stage select and three after the Null Core, each typing itself out. About 25 seconds in total. Jump moves on and Enter skips.
- **Boss intro cards:** the first time each warden appears in a run, a card shows its portrait, name and one line about it. The fight and the clock wait until it closes, and jump skips it. Boss Rush shows each card once.
- **Reboot and respawn:** dying now shows a SIGNAL LOST screen with a reboot progress bar and scan lines (no scan lines with reduced flashing), and says where you'll restart. You materialise in a beam of light. Passing a checkpoint shows a ring and a CHECKPOINT label.
- **Attract mode:** after 20 seconds on the title screen, the game plays the start of Prism Grid by itself, with no sound and nothing recorded. The inputs come from a route the route checker found (`tools/build-demo.js`), and seeded runs make it play out the same way every time. Any key, click or tap ends it.
- **Route checker fix:** since 0.17.1 a misplaced comment had switched off part of the checker's reset between search steps (enemy bullets and Phase Lab block timing). Fixed; every stage and room still passes.
- Smoke tests: 170 checks.

## 0.18 — Challenge rooms and the Daily run

- **Challenge rooms:** 20 short rooms (three per sector, two for the Null Core), each a sprint to an exit gate with gold, silver and bronze times. They open as you clear their sectors. Best times and medals are saved per room, and each room keeps its own ghost.
- **Medal times come from the route checker:** `tools/check-rooms.js --write` times a route through every room and sets gold to that time plus 5%, rounded up to half a second. CI now has a fourth check that fails if a room loses its route or its gold time becomes impossible.
- **Daily run:** three rooms picked from the date, the same for everyone that day and worked out offline, played on one clock. Your best total is kept for the day.
- The **Challenges card** replaces the wardens counter on stage select. The locked Null Core card now shows the wardens count.
- Two achievements: **Gold Standard** (a gold medal) and **All That Glitters** (gold in all twenty rooms). Progress codes carry room times and the daily best.
- Fixed: the Boss Rush intro still said four bosses.
- Smoke tests: 156 checks.
- Endless climb moves to 0.19.

## 0.18 — Modes and replays, part 1

- **Seeded runs:** everything that changes how a run plays (boss attack choices, enemy timers, lightning positions, drops) now comes from one seeded generator. The same seed and inputs replay a run exactly. Particles and sound stay random, so cosmetic settings can't change a run. This is the base for the Daily run and Challenge rooms.
- **Ghost replays:** setting a new best time in a sector saves that run as a ghost, and the next run plays a see-through copy alongside you. Normal and Hard keep separate ghosts in `voltline-ghosts` (about 8 KB for a three-minute run). Settings → Ghost replay turns it off.
- **Practice:** a third Records page starts any cleared sector from its second or third checkpoint, its mid-boss or its boss. Dying puts you back at the chosen point. Practice records nothing.
- **Respawn fix:** three checkpoints (Sky Relay's third, Tide Vault's second, Null Core's third) had an enemy standing right on them. Respawns now clear enemies within 4 tiles of the spawn point.
- Smoke tests: 140 checks, including replaying a boss fight from a seed, ghost encoding round trips, saving and playing back a ghost, and every practice start point.

## 0.17.1 — Mid-bosses

- **Six mid-bosses**, one in each warden sector, each in a walled section just after the middle checkpoint: Prism Sentry, Drop Press, Drone Carrier, Giant Clam, Meteor Head and Phase Core. The camera locks, a health bar and name appear, and the boss music plays. Beating one drops a health pickup and opens the walls.
- Dying during the fight restarts it from the checkpoint. Once beaten, a mid-boss stays beaten for the rest of that attempt at the sector, even if you die before the next checkpoint.
- Stage crushers inside the Drop Press arena park during that fight.
- Two new achievements: **Gatecrasher** (beat a mid-boss) and **Clean Break** (beat one without taking a hit). The achievements page now fits any number of entries in two columns.
- The route checkers skip mid-bosses the way they skip enemies. Smoke tests: 124 checks, including a bot beating every mid-boss, the walls coming down, and the beaten state surviving a death.

## 0.17 — New sectors

- **Orbit Deck:** low-gravity fields (`o` tiles) that turn jumps into long floaty arcs, a spike corridor crossed on floating platforms, asteroids and UFOs. Boss: **Orbiter**, a satellite that circles the arena, sweeps telegraphed laser beams and launches orbiting mines. Weapon: **Orbit Disc**, a piercing boomerang.
- **Phase Lab:** pink and blue phase blocks (`A`/`B`) that swap between solid and empty every 1.5 seconds; a block that turns solid around you pushes you out. Blink drones teleport beside you and fire a cross; phase mines are only live on one beat. Boss: **Mirror**, which mirrors your position, copies your current weapon and shields itself against everything but its weakness. Weapon: **Echo Shot**, which fires a second time a moment later.
- **Six-warden weakness loop:** Prism > Hound, Arc > Undertow, Lance > Kite, Ring > Orbiter, Disc > Mirror, Echo > Warden. Null Core now opens after all six wardens.
- **Stage select** is a two-row grid of seven sector cards with a wardens counter, and up/down moves between rows and the bars.
- Boss Rush runs all seven bosses. Both new sectors have their own music, backgrounds and intro cards, and are available as editor themes 5 and 6 with their tiles and enemies.
- Level codes accept the new tiles (`o`, `A`, `B`), enemies (`a`, `u`, `b`, `q`), bosses and themes. Older codes still load.
- The route checkers search phase timing and long low-gravity jumps; both new stages pass.
- Smoke tests: 110 checks, including low-gravity jump height, phase-block switching and push-out, the disc returning, the echo firing twice, Mirror's shield and the select grid.
- Mid-bosses moved to the next round.

## 0.16 — Community levels

- **Level gallery:** a new Gallery bar on stage select lists ten hand-built levels from `levels.json` (100 to 200 columns, every boss and theme), each with your best time. Playing one never touches your own editor level.
- **Play links:** `?level=VL1…` opens straight into a level. The title screen names it and Enter plays it. **Copy play link** in the editor makes one.
- **Verified codes:** Copy code and Copy play link run the route check first if the level changed since its last pass. A pass adds a *route verified* mark that's recomputed on load. A second press shares the level anyway.
- **Names and authors** in level codes, shown on the intro card and in the gallery. Only plain characters are kept.
- **Undo and redo** in the editor (Ctrl/Cmd+Z, Ctrl/Cmd+Y or Shift+Z, or the buttons), one step per stroke, 50 steps kept.
- **Longer levels:** 100 to 200 columns in steps of 25. Shrinking asks first if content would be lost.
- **Checkpoint safety:** checkpoints can't go in a column without solid ground.
- `tools/build-gallery.js` writes `levels.json` from recipes, but only if every level passes the route check. `tools/check-gallery.js` re-checks the gallery in CI (now three checks: smoke, route, gallery).
- The title tagline now says five sectors.
- Smoke tests: 98 checks.

## 0.15 — Access for everyone

- **Remappable controls:** Settings → Controls lists every action with its keyboard and gamepad bindings. Rebinding moves a key away from any action that had it and warns if that action is left without one. Includes Reset to defaults; Esc and Enter always work in menus. Saved in `voltline-keys`.
- **High contrast:** black background, white terrain, and fixed role colours (hero blue, enemies orange, enemy shots yellow with an outline, filled red-orange spikes, white player shots). Tuned using protanopia, deuteranopia and tritanopia simulations of real screenshots: the first draft's pink enemies matched the hero under red-green deficiency and were changed.
- **Large text:** every small label goes up to at least 10 px, and long labels shrink to fit their cards and rows.
- **Game speed:** 75% or 50%. It counts as assist, so no best times, splits or skill achievements are recorded.
- **Auto-fire** and **hold jump to swim**.
- Settings is now a scrolling list of 13 items, and its overlays are darker so the screen behind doesn't compete.
- The Records Times page shows splits for the selected difficulty.
- Accessibility statement in the README.
- Smoke tests: 81 checks.

## 0.14 — Feel (playtest round still to come)

- **Repo renamed** to `CptNope/Voltline`. The game is now at https://cptnope.github.io/Voltline/. Saves carry over because they're stored per site, not per path.
- **Coyote time:** you can still jump for 6 frames after running off a ledge.
- **Jump buffering:** a jump pressed up to 6 frames before landing happens as you land. Release early for a short hop, as usual.
- **Hit-stop:** a short freeze on boss hits (longer on a weakness hit), a longer one on the killing blow, and a heavier hit sound. It's off when Flashing and particles is set to Reduced.
- **Camera:** its lead eases toward the way you're facing instead of jumping 48 px when you turn.
- **Playtest kit:** a local playtest log (deaths with place and cause, clears, boss-fight lengths) and a **Copy playtest report** button below the game. Nothing is sent anywhere. Also `docs/PLAYTEST.md`: session guide, questions, device checklist, tuning targets and a results log.
- The version number shows on the title screen.
- Smoke tests: 69 checks.

## 0.13 — Records

- **Licensed under MIT** (`LICENSE`).
- **Roadmap rewritten:** vision and pillars, milestones 0.14 to 1.0 with sizes and done-when checks, an engineering track, a decision log and the 1.0 release checklist.

- **Achievements:** 16, with a pop-up on unlock. Skill achievements need assist off.
- **Checkpoint splits:** every checkpoint, the boss gate and the clear show how far ahead or behind your best run you are. A new best time saves its splits.
- **Records screen** (a new bar under the stage cards): an achievements page and a times page with best times, Hard bests, Boss Rush bests, best-run splits and lifetime stats.
- **Progress codes** (`VS1.`): move a save between devices. They're validated and cleaned when loaded.
- Fixed: tapping the select screen used the old four-card layout, so touch players could pick the wrong card or bar. It now matches the five cards and three bars.
- Route checks don't touch stats or achievements.
- Fixed before release: Reset progress (or any save without the new fields) made the game crash on the next death. Caught by the route-checker run in CI. A smoke check now covers older and minimal saves.
- Smoke tests: 60 checks.

## 0.12 — Tide Vault

- New sector, **Tide Vault**: flooded pools, a pillar to swim under, a bump to swim over, urchin beds and floating stepping stones.
- **Swimming:** slower movement and falling in water, a stroke on each jump press, a leap out at the surface, splashes and bubbles.
- New boss, **Undertow**: a sea serpent that hunts underwater, leaps across the arena, spits drifting bubbles and pulls you in with a whirlpool. It shoots back at the top of its leaps below half health.
- New weapon, **Tide Lance**: a fast piercing lance.
- The weakness cycle is now four links: Prism Spread beats the Coil Hound, Arc Bolt beats Undertow, Tide Lance beats the Gale Kite, and Gust Ring beats the Prism Warden. The Kite's weakness moved from Arc Bolt to Tide Lance.
- New enemy, **jellyfish**: bobs in the water and drifts toward you.
- The select screen shows five cards. The Null Core now needs all four wardens beaten; saves that already cleared it keep access.
- Boss Rush has five bosses, and the arena floods for Undertow.
- New music track and an underwater background (light shafts, bubbles, kelp).
- Editor: water tile, jellyfish, Undertow as a boss choice, and the Tide Vault theme. Level codes accept `~`, `j` and theme 4.
- The route checker understands swimming. All five stages pass, and there are 46 smoke checks.

## 0.11 — New enemies and in-editor route check

- Three new enemies:
  - **Shield walker** (Prism Grid, Null Core): blocks shots from the front, and drops its shield while firing.
  - **Spark hopper** (Coil Foundry, Null Core): leaps at you in arcs.
  - **Gull** (Sky Relay, Null Core): swoops down in a curve aimed at you.
- All three are in the level editor (18 tools) and allowed in level codes (`s`, `h`, `g`).
- **Check route** in the editor (R, or the button): runs the route search in the browser in 10 ms slices, then reports success or moves the cursor to where the route breaks.
- The editor's starter level had a 3-tile spike strip that the new check flagged; it's now 2 tiles.
- Smoke tests: 37 checks.

## 0.10 — Pause menu, settings, intro cards

- Pause menu: Resume, Weapon, Restart from checkpoint, Settings, Quit to stage select (Back to editor in custom levels).
- Settings screen (O, pause menu, or the button under the game): music and sound volume, screen shake, reduced flashing and particles, tap-to-toggle charge shot, assist (half damage or invincible). Saved with the other options.
- With assist on, spikes knock you back instead of killing you, and best times aren't recorded.
- Stage intro cards with a one-line hint for each sector.
- Gale Kite rebalanced: it cruises 10 px lower and spends 110 frames cruising between attacks (was 150). The test bot's blaster-only fight dropped from about 146 s to 53 s.
- Smoke tests cover the pause menu, settings, assist and toggle charge (31 checks).

## 0.9 — Route checker, tests and docs

- Added `tools/harness.js`, which loads the game in Node with stand-ins for the browser.
- Added `tools/smoke.js`: menus and locks, every boss can be beaten, weakness damage, Boss Rush, Hard mode damage, editor painting, level-code round trip and rejection, music switching.
- Added `tools/ghost.js`, which searches for a damage-free route through each stage using the real physics.
- Level fixes found by the route checker:
  - **Prism Grid:** the platform over the first spike pit is now 2 tiles wide (it was 1 tile, and holding right overshot it). The second spike strip is now 2 tiles wide (it was 3, leaving about 6 px of margin).
  - **Sky Relay:** the pillar near the first turret is now 3 tiles tall (it was 4, taller than a full jump). The spikes after the second pillar are now 2 tiles wide (they were 3, a jump that barely worked into a headwind).
  - **Null Core:** the platform over the first spikes is lowered by one tile. It was 64 px up, beyond the 54 px jump height.
- Wrote README, ROADMAP, CHANGELOG, CONTRIBUTING, docs/ARCHITECTURE and docs/LEVEL_CODES.

## 0.8 — Code split and visual pass

- `index.html` now loads ten classic scripts from `js/` in a fixed order. There's still no build step, and it still runs from `file://`.
- Background skylines, clouds and the core ring are dimmed and no longer glow, so walkable terrain stands out clearly.
- On touch devices the keyboard legend is hidden and the touch pad sits directly under the screen.
- Boss portraits on the select screen are clipped to their cards.
- The service worker caches the new script files.

## 0.7 — Level editor

- 100-column editor with 15 tools, boss and theme choice, an automatic boss arena and a safe start platform.
- Playtest with Enter, return with Enter. Levels autosave to `localStorage`.
- Shareable `VL1.` level codes, validated and cleaned on load.
- Esc and Backspace now pause during play and back out of menus.

## 0.6 — Boss Rush and install support

- Boss Rush mode (unlocked after the Null Core), with refills between bosses and best times per difficulty.
- App manifest, icons and an offline service worker, registered only on `github.io`.

## 0.5 — Sound, difficulty, gamepads

- Seven synthesized tracks scheduled with Web Audio: menu, four stages, boss, final boss.
- Hard mode: ×1.5 damage taken, +1 enemy health, faster turrets, ×0.7 damage to bosses, half healing. Separate best times.
- Standard gamepad support.
- M and N toggles and on-page buttons for music and sound, saved between visits.

## 0.4 — Null Core

- Fourth stage combining every earlier hazard, unlocked after the first three.
- Null Engine final boss: a shielded phase 1 and a free-floating phase 2. It takes +1 damage from every boss weapon.
- Ending screen with the total of your best times.

## 0.3 — Three sectors and weapons

- Stage select with saved progress.
- Coil Foundry (belts, crushers, lava) and Sky Relay (moving platforms, wind).
- Coil Hound and Gale Kite bosses.
- Prism Spread, Arc Bolt and Gust Ring weapons with energy bars and a weakness cycle.

## 0.2 — Repository

- Moved into `CptNope/Voltine` (renamed to `CptNope/Voltline` in 0.14) as a single `index.html`.

## 0.1 — First playable

- One stage (Prism Grid) and the Prism Warden.
- Run, variable jump, slide, ladders, charge shot, checkpoints, touch controls.
