# Voltline

A vector-graphics action platformer for the browser. Run, jump, slide, swim and blast through four sectors, take each warden's weapon, use it against the next one, then break into the Null Core.

Everything is drawn live as glowing strokes on a canvas and every sound is synthesized in the browser, so the game has no image or audio files. It's plain HTML and JavaScript with no build step and no dependencies.

> **Play it:** **https://cptnope.github.io/Voltline/**, served by GitHub Pages from `main`. You can also open `index.html` straight from a download.

![checks](https://github.com/CptNope/Voltline/actions/workflows/checks.yml/badge.svg) ![license: MIT](https://img.shields.io/badge/license-MIT-5ef2c4)

---

## Contents

- [Features](#features)
- [How to play](#how-to-play)
- [Controls](#controls)
- [Sectors and bosses](#sectors-and-bosses)
- [Weapons and weaknesses](#weapons-and-weaknesses)
- [Modes](#modes)
- [Level gallery](#level-gallery)
- [Level editor](#level-editor)
- [Saving, install and offline play](#saving-install-and-offline-play)
- [Running locally](#running-locally)
- [Project layout](#project-layout)
- [Development tools](#development-tools)
- [Documentation](#documentation)
- [Status](#status)
- [License](#license)

---

## Features

- **Seven stages** with their own hazards and enemies: spike pits, ladders, slide tunnels, conveyor belts, ceiling crushers, lava, moving platforms, lifts, headwind gusts, underwater sections you swim through, low-gravity fields and blocks that switch on and off with the beat.
- **Seven bosses**, each with its own attack patterns and a harder second stage once it drops below half health. The final boss has two distinct phases.
- **Weapon system:** a chargeable blaster plus three weapons earned from bosses, each with its own energy bar.
- **A weakness cycle:** each warden takes extra damage from another warden's weapon.
- **Stage select** with saved progress and best times.
- **Normal and Hard** difficulty, with best times kept for each.
- **Boss Rush:** all seven bosses back to back on one clock.
- **Level editor:** paint your own stage (up to 200 columns), undo and redo, playtest it instantly, and share it as a short code or a play link once the route check has verified it.
- **Level gallery:** ten hand-built levels, each route-checked on every push, with your best time on each.
- **Records:** 16 achievements, checkpoint splits against your best run, lifetime stats, and a progress code to move your save between devices.
- **Synthesized soundtrack:** seven tracks, one per stage, plus a menu, boss and final-boss theme.
- **Keyboard, gamepad and touch** controls. The touch pad appears automatically on phones and tablets.
- **Pause menu and settings:** restart from the last checkpoint, quit to stage select, adjust music and sound volume, turn screen shake off, reduce flashing, switch the charge shot to tap-to-toggle, and turn on an assist mode.
- **Installable and offline-capable** when served from GitHub Pages.

## How to play

1. On the title screen, pick **Normal** or **Hard** with ← → and press **Enter**.
2. Choose a sector. Prism Grid, Coil Foundry, Sky Relay and Tide Vault can be played in any order.
3. Fight through to the boss arena at the end. The gate closes behind you, and the boss's health bar shows top right.
4. Beat the boss to earn its weapon. Switch weapons with **Q / E**, and keep an eye on the energy bar under your health.
5. Beat all four wardens to open **Null Core**. Clear that to unlock **Boss Rush**.

**Forgiving jumps:** you can still jump for a split second after running off a ledge, and a jump pressed just before you land happens as you touch down.

**Swimming:** in water you fall slowly and move a little slower. Each tap of jump is a stroke upward, and a stroke at the surface launches you out of the water. Sliding doesn't work underwater.

**Checkpoints:** gold pylons along each stage light up as you pass them. If you lose all your health ("Signal lost"), you restart at the last one with full health and refilled weapon energy.

**Pickups:** mint diamonds restore health. Gold diamonds restore weapon energy, going to the weapon you're holding, or to the emptiest one if you're on the blaster. Defeated enemies sometimes drop smaller versions of both.

## Controls

| Action | Keyboard | Gamepad | Touch |
|---|---|---|---|
| Move | ← → or A D | D-pad / left stick | ◀ ▶ |
| Climb ladders | ↑ ↓ or W S | D-pad / left stick | ▲ ▼ |
| Jump (hold for higher) | Z, K or Space | A | JUMP |
| Fire | X or J | B or X | FIRE |
| Charge shot (Volt Buster) | hold fire, release | hold B / X | hold FIRE |
| Slide | ↓ + Jump | down + A | ▼ + JUMP |
| Swim up (in water) | tap Jump | tap A | tap JUMP |
| Switch weapon | Q / E (also C) | LB / RB, Y | WPN |
| Start / pause | Enter or P | Start | START |
| Back / pause | Esc or Backspace | — | — |
| Settings | O | — | Settings button under the game |

These are the defaults. Every key and button can be changed in **Settings → Controls**.
| Music on/off | M | Select | button under the game |
| Sound on/off | N | — | button under the game |

The **pause menu** has Resume, Weapon (◀ ▶ to switch), Restart from checkpoint, Settings, and Quit to stage select (Back to editor in custom levels). Q / E switch weapons anywhere.

## Sectors and bosses

| Sector | Hazards | Boss | Boss attacks |
|---|---|---|---|
| **Prism Grid** | spike pits, a ladder wall, a tunnel you have to slide through | **Prism Warden** | hops at you, fires aimed spreads, charges into the walls. Adds ground shockwaves below half health. |
| **Coil Foundry** | conveyor belts, ceiling crushers, lava, a high route over a lava floor | **Coil Hound** | pounces, sends sparks along the floor, charges back and forth off the walls, calls down lightning with warning lines |
| **Sky Relay** | moving platforms, lifts, regular headwind gusts | **Gale Kite** | flies in loops dropping darts, dives at you, blows wind to push you around |
| **Tide Vault** | flooded pools to swim through, low gaps to swim under, urchin beds on the pool floors | **Undertow** | a sea serpent that hunts you underwater, leaps across the arena in long arcs, surfaces to spit drifting bubbles, and stirs a whirlpool that drags you toward it |
| **Orbit Deck** | low-gravity fields for long floaty jumps, a spike corridor crossed on floating platforms, asteroids and UFOs | **Orbiter** | a satellite that circles the arena, telegraphs laser beams then sweeps them, and launches orbiting mines at you |
| **Phase Lab** | pink and blue blocks that swap between solid and empty every 1.5 seconds, blink drones, phase mines | **Mirror** | mirrors your position across the arena, copies your current weapon, and raises a shield that only its weakness gets through |
| **Null Core** (final) | all of the above, combined | **Null Engine** | Phase 1: a tethered core behind four shield orbs that block shots, with aimed fire, lightning and flying minions. Phase 2: the shields break, the core floats free and borrows every other boss's attacks. |

### Mid-bosses

Each warden sector has a mid-boss in a walled-off section just after its middle checkpoint. The walls stay up and the camera locks until it's beaten. If you die during the fight, you restart at that checkpoint. Once it's beaten, it stays beaten for the rest of that attempt at the sector. The Null Core has none; it's a gauntlet already.

| Sector | Mid-boss | What it does |
|---|---|---|
| Prism Grid | **Prism Sentry** | weaves through the air firing aimed fans, then a ring of shots |
| Coil Foundry | **Drop Press** | tracks you along the ceiling, slams down and throws sparks both ways along the floor. The stage's crushers park during the fight. |
| Sky Relay | **Drone Carrier** | sweeps overhead, dips low, launches flyers (three at most) and drops bombs |
| Tide Vault | **Giant Clam** | stays shut (shots bounce off), then opens to spit drifting bubbles. Only hurt while open. |
| Orbit Deck | **Meteor Head** | bounces around the arena, stopping to burst rocks in eight directions |
| Phase Lab | **Phase Core** | rises behind a shield and fires rings on the blue beat; sinks to shooting height and can be hurt on the pink beat |

## Enemies

| Enemy | Found in | Behaviour | Tip |
|---|---|---|---|
| Walker | everywhere | patrols and turns at ledges | anything works |
| Flyer | everywhere | drifts toward you in a wave | shoot it as it lines up |
| Turret | everywhere | aims and fires every couple of seconds (faster on Hard) | the barrel glows just before it fires |
| **Shield walker** | Prism Grid, Null Core | turns to face you behind a shield that blocks shots; stops every few seconds to fire, which drops the shield | hit it while it fires, from behind, with a charged shot, or with an Arc Bolt from above |
| **Spark hopper** | Coil Foundry, Null Core | waits, then bounds at you in big arcs | shoot it mid-air or step under the jump |
| **Gull** | Sky Relay, Tide Vault, Null Core | hovers high and swoops down at you in a curve, then climbs back | wait for the swoop and shoot as it comes down |
| **Jellyfish** | Tide Vault | bobs up and down in the water and drifts toward you | stings on touch; time your swim between its bobs |
| **Asteroid** | Orbit Deck | drifts back and forth, bobbing | tough; clear it before a long jump |
| **UFO** | Orbit Deck | shadows you from above and drops a bolt when it's overhead | keep moving, shoot it as it lines up |
| **Blink drone** | Phase Lab | teleports next to you, then fires a cross of shots | step off the cross lines, then shoot |
| **Phase mine** | Phase Lab | harmless on one beat, live on the other (it glows when live) | walk through it on the safe beat |

## Weapons and weaknesses

| Weapon | From | Cost | What it does | Extra damage against |
|---|---|---|---|---|
| **Volt Buster** | start | free | Up to three quick shots on screen. Hold to charge a big piercing shot (3 damage). | — |
| **Prism Spread** | Prism Warden | 2 | three-way fan of shots | **Coil Hound** |
| **Arc Bolt** | Coil Hound | 3 | heavy lob (3 damage) that bounces twice along the floor | **Undertow** |
| **Gust Ring** | Gale Kite | 4 | four orbs circle you and destroy enemy bullets. Fire again to throw them. | **Orbiter** |
| **Tide Lance** | Undertow | 3 | fast lance (2 damage) that pierces everything in a line | **Gale Kite** |
| **Orbit Disc** | Orbiter | 2 | a disc that flies out and comes back, cutting through everything | **Mirror** |
| **Echo Shot** | Mirror | 2 | a shot that fires again from the same spot a moment later | **Prism Warden** |

A weakness hit does 4 damage, flashes "WEAK!" and staggers the boss. The Null Engine has no single weakness but takes +1 damage from every boss weapon. Each weapon has 28 energy.

## Modes

**Hard.** Pick it on the title screen. You take 50% more damage, enemies have an extra hit point, turrets fire more often, bosses take 30% less damage per hit, and health pickups heal half as much. Hard best times are saved separately.

**Boss Rush.** Unlocks after the Null Core. Fight all seven bosses (Prism Warden → Coil Hound → Gale Kite → Undertow → Orbiter → Mirror → Null Engine) in a row on one clock, with a health and energy refill between fights. If you die, you restart at the current boss and the clock keeps running.

**Story.** Four short cards the first time you start, and three after the Null Core, each typing itself out. Jump moves on and Enter skips the rest. Each warden's first appearance in a run opens a card with its portrait and one line about it. The fight and the clock wait until the card closes (jump skips it).

**Music.** Every track plays a second pass with a harmony line, an arpeggio and extra hi-hats, and every boss fight adds a driving layer once the boss is below half health.

**Attract mode.** Leave the title screen alone for 20 seconds and the game plays the start of Prism Grid by itself. Any key, click or tap ends it.

**Challenge rooms.** The Challenges card on stage select opens 20 short rooms, three for each sector plus two for the Null Core. Each one is a sprint to an exit gate with gold, silver and bronze times. A room opens once you've cleared its sector (Prism Grid's rooms are open from the start). Your best time and medal are saved for each room, and each room keeps its own ghost.

**Daily run.** At the top of the room list. Three rooms picked from the date, the same for everyone that day, played back to back on one clock. It works offline because the choice comes from the date alone. Your best total is kept for the day.

**Ghost replays.** When you set a new best time in a sector, that run is saved as a ghost. Next time, a see-through copy of your best run plays alongside you. Normal and Hard keep separate ghosts. Turn it off with Settings → Ghost replay.

**Practice.** Records → Practice (the third page) starts any sector you've cleared from its second or third checkpoint, its mid-boss, or its boss. Dying puts you back at the point you picked. Practice runs record nothing: no best times, splits, ghosts, achievements or clears.

## Settings and accessibility

Open **Settings** with **O**, from the pause menu, or with the button under the game. Changes save straight away. The list scrolls.

| Setting | Options | What it does |
|---|---|---|
| Music volume | 0–10 | soundtrack level (M still mutes) |
| Sound volume | 0–10 | effects level (N still mutes) |
| Screen shake | On / Off | turns every camera shake off |
| Flashing and particles | Full / Reduced | no white hit flashes, blinking or hit-stop; steady warning lines; one third of the particles. The hero turns see-through instead of blinking while invulnerable. |
| High contrast | On / Off | black background, white terrain, and one colour per role: hero blue, enemies and bosses orange, enemy shots yellow with a black outline, spikes filled red-orange, your shots white. Checked against protanopia, deuteranopia and tritanopia simulations. |
| Text size | Normal / Large | raises every small label to at least 10 px (about 1.2×), and long labels shrink to fit their space |
| Charge shot | Hold / Tap to toggle | Tap to toggle: one tap fires and starts charging, the next tap releases the charged shot |
| Auto-fire | On / Off | holding fire keeps shooting (not for the Gust Ring, which toggles) |
| Hold jump to swim | On / Off | holding jump keeps swimming strokes coming |
| Assist | Off / Half damage / Invincible | Half damage halves every hit. Invincible ignores hits. With either, spikes knock you back instead of killing you; pits still reset you. |
| Game speed | 100% / 75% / 50% | slows gameplay (menus and music stay at normal speed) |
| Ghost replay | On / Off | shows a see-through copy of your best run in each sector |
| Controls | — | rebind every keyboard key and gamepad button (below) |

**Assist or a slower game speed** keeps every stage playable but doesn't record best times, splits or the skill achievements, so the Records stay comparable.

**Controls:** in Settings → Controls, pick an action, choose the keyboard or gamepad column with ← →, press Enter, then press the new key or button. If it was already in use, it moves to the new action and the screen says which action lost it. Esc cancels, and **Reset to defaults** restores everything. Esc and Enter always work in menus, even after remapping, so you can't lock yourself out. Directions on a gamepad always use the D-pad and the left stick.

Each stage opens with a short card showing its name and a hint about its main hazard.

### Accessibility statement

Voltline aims to be playable by as many people as possible. Every option is in the table above. What it supports today:

- **Input:** keyboard, gamepad and touch; full remapping of keys and buttons; tap-to-toggle charge; auto-fire; hold-to-swim. A one-handed layout can be built from those.
- **Vision:** a high-contrast mode tested with colour-blindness simulations; shape differences between hazards, enemies and shots, so colour isn't the only cue; a large-text option.
- **Motion and flashing:** screen shake off; reduced flashing, particles and hit-stop.
- **Difficulty and timing:** Normal and Hard; assist with half damage or invincibility; game speed at 75% or 50%.
- **Hearing:** every attack has a visual tell (glowing barrels, shaking crushers, dashed lightning warnings), so sound is never required.

**Known gaps:**
- Text larger than about 1.2× isn't available yet.
- Screen readers can't follow gameplay. The page around the game is labelled, but the game itself is a canvas.
- Menus need a keyboard, a gamepad or the touch pad. The editor can also be used with a mouse.
- None of this has been tested with disabled players yet.

Please report problems the way [CONTRIBUTING.md](CONTRIBUTING.md#reporting-balance-problems) describes; accessibility reports are top priority.

## Level gallery

Choose **Gallery** from the bar under the stage cards. It lists curated levels from [`levels.json`](levels.json) with name, author, boss, length, a ✓ for levels whose route is verified, and your best time on each (Normal, assist off). Playing a gallery level never touches the level in your own editor. Enter during play, or after the clear, takes you back to the gallery.

Want a level in the gallery? See [CONTRIBUTING.md](CONTRIBUTING.md#adding-a-gallery-level).

## Level editor

Pick **Level Editor** from the bar under the stage cards.

- **Canvas:** 100 columns × 17 rows. A safe start platform sits on the left and a boss arena is added after column 100 automatically.
- **Tools:** block, spikes, water, ladder, belt → and belt ←, walker, shield walker, spark hopper, flyer, gull, jellyfish, turret, health, energy, platform (moves sideways), lift (moves up and down), crusher, checkpoint (up to three), erase.
- **Boss, theme and width:** chosen with the buttons under the game. The theme sets the colours and music, and the Sky theme adds wind. Width goes from 100 to 200 columns in steps of 25; shrinking a level that would lose content asks first.
- **Name and author:** typed into the boxes under the game, and shown on the level's intro card and in the gallery. Letters, numbers and basic punctuation only.
- **Undo and redo:** Ctrl/Cmd+Z and Ctrl/Cmd+Y (or Shift+Z), or the buttons. Each stroke is one step, and 50 steps are kept.
- **Checkpoints** can only go in a column with solid ground somewhere in it, so a respawn can't drop you into a pit.

| Editor action | Keyboard | Mouse / touch |
|---|---|---|
| Move cursor | arrows (hold to repeat) | click a cell |
| Paint / place | Z | click, or drag for tiles |
| Erase | X | Erase tool |
| Change tool | Q / E | click the tool bar |
| Scroll | move the cursor | ◀ ▶ at the screen edges |
| Check route | R | Check route button |
| Undo / redo | Ctrl+Z / Ctrl+Y | Undo / Redo buttons |
| Playtest | Enter | Playtest button |
| Back to the editor from a playtest | Enter | START |
| Leave | Esc | Exit editor button |

**Check route** runs the same search as `tools/ghost.js` inside the browser, ignoring enemies. It either confirms the level can be finished or moves the cursor to where the search got stuck. It usually takes a few seconds, and Esc cancels.

Your level saves in the browser as you work.

**Sharing:** **Copy code** gives a short text code, and **Copy play link** gives a URL such as `https://cptnope.github.io/Voltline/?level=VL1…` that opens straight into your level. If the level hasn't passed a route check since its last change, the first press runs the check. Press again to copy: the copy carries a *route verified* mark if the check passed. You can still share an unverified level with that second press. To play someone else's level, paste their code or link into the box and press **Load pasted code** (that replaces your editor level, and Undo brings yours back), or just open their play link. A play link plays the level without touching your own. Codes are checked when loaded, and anything malformed is rejected or cleaned up. The format is in [docs/LEVEL_CODES.md](docs/LEVEL_CODES.md).

## Records, achievements and splits

Choose **Records** from the bar under the stage cards. It has two pages; switch between them with ← →.

- **Achievements:** 16 of them, with a pop-up when one unlocks. Ones marked * need assist off.

  | Achievement | How |
  |---|---|
  | First Light | clear any sector |
  | Pressure Point | land a weakness hit on a boss |
  | Full Charge | defeat an enemy with a charged shot |
  | Around the Shield | defeat a shield walker |
  | Sting Operation | defeat a jellyfish |
  | Untouched * | beat a boss without taking a hit |
  | Clean Run * | clear a sector without a reboot |
  | Full Arsenal | own all four boss weapons |
  | Wardens Down | beat all four wardens |
  | The Grid Is Free | clear the Null Core |
  | Hard Light * | clear the Null Core on Hard |
  | Gauntlet | finish Boss Rush |
  | Iron Gauntlet * | finish Boss Rush on Hard |
  | Prism Sprint * | clear Prism Grid in under 2:30 |
  | Centurion | defeat 100 enemies |
  | Architect | beat a level you built in the editor |

- **Times:** your best time per sector on Normal and Hard, Boss Rush bests, the split times from your best Normal run, and lifetime stats (enemies defeated, pickups, reboots).
- **Splits during a run:** each checkpoint, the boss gate and the clear are split points. If you have a best run for that sector and difficulty, crossing one shows how far ahead (green, −) or behind (red, +) you are. A new best time saves that run's splits. Splits aren't kept while assist is on.

## Saving, install and offline play

Progress lives in your browser's `localStorage` on this device:

| Key | Holds |
|---|---|
| `voltline-v2` | cleared sectors, best times and splits (Normal and Hard), Boss Rush bests, achievements, lifetime stats |
| `voltline-opts` | music and sound toggles, difficulty, and every setting above |
| `voltline-v2` → `rooms`, `daily` | best time per challenge room, and the day's best daily total |
| `voltline-ghosts` | one ghost per sector and difficulty: the best time and the encoded run (about 8 KB for a three-minute run) |
| `voltline-edit` | your current editor level |

**Reset progress** (under the game) clears the first one. It asks you to click twice.

**Moving to another device:** open *Move your progress to another device* under the game, press **Copy progress code**, and on the other device paste it and press **Load progress code**. Loading replaces that device's progress, so it asks you to click twice. Codes start with `VS1.` and are checked and cleaned when loaded.

**Playtest report:** the same panel has **Copy playtest report**, a short text summary of where you died and from what, your clears and how long each boss fight took. It's kept only on this device and leaves it only if you paste it somewhere. See [docs/PLAYTEST.md](docs/PLAYTEST.md) for running a playtest.

When served from `*.github.io`, the game registers a service worker (`sw.js`) and has an app manifest, so it can be installed to a home screen or desktop and played offline after the first visit.

## Running locally

Any static file server works. From the repo folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from disk also works. The scripts are deliberately not ES modules for this reason. The service worker only registers on `github.io`, so local testing is never cached.

## Project layout

```
index.html              page shell, styles, touch pad, editor panel, script tags (load order matters)
js/core.js              canvas setup, colours, weapons, stage data, boss roster
js/world.js             saved progress, options, map building, collision physics
js/input.js             keyboard, touch pad and pointer input
js/audio.js             sound effects, soundtrack engine and tracks, gamepad polling
js/entities.js          run state, player, platforms, crushers, wind, regular enemies
js/bosses.js            the seven bosses and stage-clear handling
js/sectors.js           Orbit Deck and Phase Lab stage data
js/step.js              projectiles, pickups, particles and the per-frame step
js/render.js            all drawing: backgrounds, tiles, sprites, HUD, menus
js/editor.js            level editor and level codes
js/route.js             in-browser route checker for the editor
js/records.js           achievements, splits, stats, Records screen, progress codes
js/gallery.js           the level gallery screen
levels.json             gallery levels (built by tools/build-gallery.js)
js/main.js              starts the loop, registers the service worker
tools/harness.js        loads the game headless in Node for testing
tools/smoke.js          smoke tests for menus, bosses, modes, editor and music
tools/ghost.js          route checker that proves each stage can be finished
tools/build-gallery.js  gallery level recipes; writes levels.json only if every level passes the route check
tools/check-gallery.js  CI check that every gallery level decodes, is verified and passes the route check
sw.js                   offline cache (bump VERSION when files change)
manifest.webmanifest    install metadata
icon-192.png, icon-512.png
docs/                   architecture notes and the level-code format
```

How the pieces fit together, and how to add a stage, enemy, boss or weapon, is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Development tools

Node 18 or newer. No packages to install.

```sh
node tools/smoke.js     # ~1 min: menus, locks, every boss beatable, weaknesses, Boss Rush, Hard, editor, level codes, music
node tools/ghost.js     # ~1 min: searches for a damage-free route through each stage with the real physics
node tools/ghost.js 2   # check a single stage (0 Prism, 1 Foundry, 2 Sky, 3 Core)
```

`ghost.js` takes out the enemies but keeps every pit, spike, crusher, belt, platform and gust. It then searches with jump, run, wait, slide and climb inputs until it reaches the boss gate. If you change a stage, run it: a jump that's too tall or too tight makes it fail and tells you how far it got. It has already caught four impossible or near-impossible jumps.

Contribution workflow and conventions are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Documentation

- [ROADMAP.md](ROADMAP.md): vision, milestones from 0.14 to 1.0 with done-when checks, the engineering track, decisions and known issues
- [CHANGELOG.md](CHANGELOG.md): what changed in each version
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): engine design and how-to guides for extending it
- [docs/LEVEL_CODES.md](docs/LEVEL_CODES.md): the shareable level format
- [CONTRIBUTING.md](CONTRIBUTING.md): how to work on the game
- [docs/PLAYTEST.md](docs/PLAYTEST.md): how to run a playtest and what to measure

## Status

All content is in place and covered by the automated checks above, but the game hasn't been play-tested by people yet. Difficulty, boss pacing and music volume are first-pass values. See [ROADMAP.md](ROADMAP.md) for what's planned and what's known to need work.

## License

[MIT](LICENSE). You're free to use, copy, modify and share the code, including commercially, as long as the copyright and license notice stay with it.
