# Changelog

Versions are informal milestones. Newest first.

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

- Moved into `CptNope/Voltine` as a single `index.html`.

## 0.1 — First playable

- One stage (Prism Grid) and the Prism Warden.
- Run, variable jump, slide, ladders, charge shot, checkpoints, touch controls.
