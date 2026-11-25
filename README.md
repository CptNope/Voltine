# Voltline

A vector-graphics action platformer for the browser. Run, jump, slide, swim and blast through four sectors, take each warden's weapon, use it against the next one, then break into the Null Core.

Everything is drawn live as glowing strokes on a canvas and every sound is synthesized in the browser, so the game has no image or audio files. It's plain HTML and JavaScript with no build step and no dependencies.

> **Play it:** **https://cptnope.github.io/Voltine/**, served by GitHub Pages from `main`. You can also open `index.html` straight from a download.

![checks](https://github.com/CptNope/Voltine/actions/workflows/checks.yml/badge.svg)

---

## Contents

- [Features](#features)
- [How to play](#how-to-play)
- [Controls](#controls)
- [Sectors and bosses](#sectors-and-bosses)
- [Weapons and weaknesses](#weapons-and-weaknesses)
- [Modes](#modes)
- [Level editor](#level-editor)
- [Saving, install and offline play](#saving-install-and-offline-play)
- [Running locally](#running-locally)
- [Project layout](#project-layout)
- [Development tools](#development-tools)
- [Documentation](#documentation)
- [Status](#status)

---

## Features

- **Five stages** with their own hazards and enemies: spike pits, ladders, slide tunnels, conveyor belts, ceiling crushers, lava, moving platforms, lifts, headwind gusts and underwater sections you swim through.
- **Five bosses**, each with its own attack patterns and a harder second stage once it drops below half health. The final boss has two distinct phases.
- **Weapon system:** a chargeable blaster plus three weapons earned from bosses, each with its own energy bar.
- **A weakness cycle:** each warden takes extra damage from another warden's weapon.
- **Stage select** with saved progress and best times.
- **Normal and Hard** difficulty, with best times kept for each.
- **Boss Rush:** all five bosses back to back on one clock.
- **Level editor:** paint your own stage, playtest it instantly, and share it as a short text code.
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
| **Null Core** (final) | all of the above, combined | **Null Engine** | Phase 1: a tethered core behind four shield orbs that block shots, with aimed fire, lightning and flying minions. Phase 2: the shields break, the core floats free and borrows every other boss's attacks. |

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

## Weapons and weaknesses

| Weapon | From | Cost | What it does | Extra damage against |
|---|---|---|---|---|
| **Volt Buster** | start | free | Up to three quick shots on screen. Hold to charge a big piercing shot (3 damage). | — |
| **Prism Spread** | Prism Warden | 2 | three-way fan of shots | **Coil Hound** |
| **Arc Bolt** | Coil Hound | 3 | heavy lob (3 damage) that bounces twice along the floor | **Undertow** |
| **Gust Ring** | Gale Kite | 4 | four orbs circle you and destroy enemy bullets. Fire again to throw them. | **Prism Warden** |
| **Tide Lance** | Undertow | 3 | fast lance (2 damage) that pierces everything in a line | **Gale Kite** |

A weakness hit does 4 damage, flashes "WEAK!" and staggers the boss. The Null Engine has no single weakness but takes +1 damage from every boss weapon. Each weapon has 28 energy.

## Modes

**Hard.** Pick it on the title screen. You take 50% more damage, enemies have an extra hit point, turrets fire more often, bosses take 30% less damage per hit, and health pickups heal half as much. Hard best times are saved separately.

**Boss Rush.** Unlocks after the Null Core. Fight Prism Warden → Coil Hound → Gale Kite → Undertow → Null Engine in a row on one clock, with a health and energy refill between fights. If you die, you restart at the current boss and the clock keeps running.

## Settings and accessibility

Open **Settings** with **O**, from the pause menu, or with the button under the game. Changes save straight away.

| Setting | Options | What it does |
|---|---|---|
| Music volume | 0–10 | soundtrack level (M still mutes) |
| Sound volume | 0–10 | effects level (N still mutes) |
| Screen shake | On / Off | turns every camera shake off |
| Flashing and particles | Full / Reduced | no white hit flashes or blinking, steady warning lines, one third of the particles. The hero turns see-through instead of blinking while invulnerable. |
| Charge shot | Hold / Tap to toggle | Tap to toggle: one tap fires and starts charging, the next tap releases the charged shot. No holding needed. |
| Assist | Off / Half damage / Invincible | Half damage halves every hit. Invincible ignores hits. With either, spikes knock you back instead of killing you. Pits still reset you to the checkpoint. **Best times aren't recorded while assist is on.** |

Each stage opens with a short card showing its name and a hint about its main hazard.

## Level editor

Pick **Level Editor** from the bar under the stage cards.

- **Canvas:** 100 columns × 17 rows. A safe start platform sits on the left and a boss arena is added after column 100 automatically.
- **Tools:** block, spikes, water, ladder, belt → and belt ←, walker, shield walker, spark hopper, flyer, gull, jellyfish, turret, health, energy, platform (moves sideways), lift (moves up and down), crusher, checkpoint (up to three), erase.
- **Boss and theme:** chosen with the buttons under the game. The theme sets the colours and music, and the Sky theme adds wind.

| Editor action | Keyboard | Mouse / touch |
|---|---|---|
| Move cursor | arrows (hold to repeat) | click a cell |
| Paint / place | Z | click, or drag for tiles |
| Erase | X | Erase tool |
| Change tool | Q / E | click the tool bar |
| Scroll | move the cursor | ◀ ▶ at the screen edges |
| Check route | R | Check route button |
| Playtest | Enter | Playtest button |
| Back to the editor from a playtest | Enter | START |
| Leave | Esc | Exit editor button |

**Check route** runs the same search as `tools/ghost.js` inside the browser, ignoring enemies. It either confirms the level can be finished or moves the cursor to where the search got stuck. It usually takes a few seconds, and Esc cancels.

Your level saves in the browser as you work. **Copy code** produces a short text code, usually a few hundred characters. Paste someone else's code into the box and press **Load pasted code** to play it. Codes are checked when loaded, and anything malformed is rejected or cleaned up. The format is documented in [docs/LEVEL_CODES.md](docs/LEVEL_CODES.md).

## Saving, install and offline play

Progress lives in your browser's `localStorage` on this device:

| Key | Holds |
|---|---|
| `voltline-v2` | cleared sectors, best times (Normal and Hard), Boss Rush bests |
| `voltline-opts` | music and sound toggles, difficulty, and every setting above |
| `voltline-edit` | your current editor level |

**Reset progress** (under the game) clears the first one. It asks you to click twice.

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
js/bosses.js            the five bosses and stage-clear handling
js/step.js              projectiles, pickups, particles and the per-frame step
js/render.js            all drawing: backgrounds, tiles, sprites, HUD, menus
js/editor.js            level editor and level codes
js/route.js             in-browser route checker for the editor
js/main.js              starts the loop, registers the service worker
tools/harness.js        loads the game headless in Node for testing
tools/smoke.js          smoke tests for menus, bosses, modes, editor and music
tools/ghost.js          route checker that proves each stage can be finished
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

- [ROADMAP.md](ROADMAP.md): what's done, what's next, known issues and open decisions
- [CHANGELOG.md](CHANGELOG.md): what changed in each version
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): engine design and how-to guides for extending it
- [docs/LEVEL_CODES.md](docs/LEVEL_CODES.md): the shareable level format
- [CONTRIBUTING.md](CONTRIBUTING.md): how to work on the game

## Status

All content is in place and covered by the automated checks above, but the game hasn't been play-tested by people yet. Difficulty, boss pacing and music volume are first-pass values. See [ROADMAP.md](ROADMAP.md) for what's planned and what's known to need work.

The repository has no license yet, so all rights are reserved by default. See the open decisions in the roadmap.
