# Voltline roadmap

Where the game stands, what comes next, and what's known to need work. Items in each section are in priority order. When something ships, move it to **Done** and add a line to [CHANGELOG.md](CHANGELOG.md).

**Current version: 0.9** (see the changelog). Everything listed under Done is covered by `tools/smoke.js` and `tools/ghost.js`, but **none of it has been play-tested by people yet**. That's the biggest gap, and it's why the first item under Now is a playtest pass rather than a feature.

---

## Open decisions

These need an owner's call before related work can go ahead.

| Decision | Options | Notes |
|---|---|---|
| **License** | MIT, a source-available licence, or keep all rights reserved | No license file means nobody else may legally reuse the code. Pick one before inviting contributors or sharing widely. |
| **Repo name** | rename `Voltine` → `Voltline`, or keep it | The repo name is missing an "l" compared with the game title. Renaming changes the Pages URL, so do it before sharing links. GitHub redirects the old repo URL, but not the old Pages URL. |
| **Fonts offline** | keep Google Fonts, or bundle Chakra Petch as a file | The service worker caches the font after the first visit. Bundling it would make a fresh offline install exact and remove the third-party request. |
| **Target platform** | browser only, or also wrap for desktop or Steam | This affects whether to invest in save export, achievements and a settings screen. |

## Now

1. **Human playtest pass.** Play every stage on Normal and Hard and record where you die, what feels unfair and what drags. Then tune values, not code:
   - The Gale Kite fight takes the test bot about 2½ minutes with the blaster. It's probably too long for players without the Arc Bolt. Consider lowering its health, letting it hover lower, or shortening its idle time between attacks.
   - Null Engine phase 1 may be too short: the bot breaks it in about 4 seconds with boss weapons.
   - Crusher timing in Coil Foundry and the gust strength in Sky Relay are untested by hand.
   - Music and sound-effect volumes haven't been heard by anyone yet.
2. **Enable GitHub Pages** and check the install and offline flow on a real phone (Android Chrome, iOS Safari).
3. **Watch the GitHub Actions checks** (`.github/workflows/checks.yml`). They run the smoke tests and route checker on every push. Keep them green.
4. **Touch editing check.** Painting and dragging in the editor with a finger hasn't been tested on a real device.

## Next

- **Settings screen:** separate music and sound volume sliders, remappable keys, screen shake on/off, reduced flashing.
- **Accessibility:** a reduced-motion mode (less shake, fewer particles), high-contrast palette option, an option to hold-to-charge without holding (toggle charge), and an assist mode with an invincibility toggle or extra health.
- **Stage intro cards:** show the sector name and a one-line hint for new mechanics when a stage starts.
- **Pause menu options:** restart from checkpoint, return to stage select.
- **Run the route checker on custom levels:** a "Check route" button in the editor that runs the same search and tells you whether your level can be finished.
- **More enemy types,** at least one new one per sector (a shielded walker for Prism, a hopping spark for Foundry, a diving gull for Sky).
- **Best-time splits:** show checkpoint split times against your best run.

## Later

- **Endless or challenge mode:** randomized rooms stitched from hand-made chunks, with every chunk passing the route checker.
- **A level gallery:** a curated list of community level codes in the repo, loaded from a JSON file.
- **Second set of sectors** with new mechanics: low gravity, water currents, disappearing blocks.
- **Achievements:** local only, stored with progress.
- **Save export and import:** a progress code like the level codes, so players can move between devices.
- **Controller vibration** on hits and explosions, through the Gamepad API's haptics where supported.

## Ideas parking lot

Unscheduled. Promote to Next or Later when there's a reason.

- Photo mode or a GIF export of boss kills (canvas `captureStream`)
- A speedrun timer overlay with frame-precise timing
- Daily seed challenge
- Two-player co-op on one keyboard or two gamepads
- Localization of the UI text

## Known issues

| Issue | Severity | Notes |
|---|---|---|
| Not play-tested by people | high | See Now, item 1. |
| Gale Kite fight is long with the blaster | medium | Tuning, not a bug. |
| A custom level whose checkpoint is over a pit makes you die on every respawn | low | The editor could block checkpoints over gaps, or respawn at the start instead. |
| Font falls back to monospace until Google Fonts loads | low | See the fonts decision above. |
| `sw.js` `VERSION` must be bumped by hand when files change | low | Could be automated in CI. |
| Maskable icon art comes close to the safe-zone edge | cosmetic | Some Android launchers may crop the fin. |

## Done

| Version | Highlights |
|---|---|
| 0.9 | Route checker and smoke tests in `tools/`; fixed four impossible or near-impossible jumps it found; full documentation |
| 0.8 | Code split into ten ordered script files; visual fixes from real-browser screenshots (background contrast, phone layout, select portraits) |
| 0.7 | Level editor with playtest, autosave and shareable level codes |
| 0.6 | Boss Rush; installable PWA with offline support |
| 0.5 | Soundtrack, Hard mode, gamepad support, music and sound toggles |
| 0.4 | Null Core fortress and the two-phase Null Engine |
| 0.3 | Stage select, Coil Foundry, Sky Relay, three boss weapons with a weakness cycle |
| 0.2 | Moved into this repo |
| 0.1 | First playable: one stage, the Prism Warden, run / jump / slide / climb / charge shot |
