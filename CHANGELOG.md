# Changelog

Versions are informal milestones. Newest first.

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
