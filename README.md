# Voltline

A vector-graphics action platformer that runs in the browser. Plain HTML and JavaScript: no build step, no dependencies.

Pick one of three sectors, fight through to its warden, and take the boss's weapon. Each warden is weak to another warden's weapon. Clear all three and the Null Core fortress opens, ending in a two-phase fight with the Null Engine.

| Sector | Boss | Hazards | Weapon earned |
|---|---|---|---|
| Prism Grid | Prism Warden | spikes, ladder wall, slide tunnel | Prism Spread (3-way fan) |
| Coil Foundry | Coil Hound | conveyors, crushers, lava | Arc Bolt (bouncing lob) |
| Sky Relay | Gale Kite | moving platforms, headwind gusts | Gust Ring (orbit shield, throwable) |
| Null Core (final) | Null Engine | everything above, combined | — |

Beat the Null Core to unlock **Boss Rush**: all four bosses back to back on one clock, with a refill between fights. Best times are kept per difficulty.

## Level editor

Choose **Level Editor** on the select screen. Paint a 100-column stage with blocks, spikes, ladders, belts, enemies, pickups, moving platforms, lifts, crushers and up to three checkpoints. A boss arena is added at the end automatically; pick the boss and the theme from the panel under the game.

| Editor action | Keys |
|---|---|
| Move cursor | arrows (hold to repeat) |
| Paint / place | Z or click and drag |
| Erase | X |
| Change tool | Q / E or click the tool bar |
| Playtest | Enter (Enter again returns to the editor) |
| Leave | Esc |

Levels save in the browser automatically. **Copy code** gives a short text code you can send to someone; they paste it and press **Load pasted code**.

## Controls

| Action | Keys |
|---|---|
| Move | ← → or A D |
| Ladders | ↑ ↓ |
| Jump | Z, K or Space (hold for higher) |
| Fire | X or J (hold Volt Buster to charge) |
| Slide | ↓ + Jump |
| Switch weapon | Q / E |
| Start / pause | Enter (Esc also pauses) |
| Music / sound toggle | M / N |
| Difficulty | ← → on the title screen (Normal or Hard) |

Touch controls appear automatically on phones and tablets, and standard gamepads work (A jump, B/X fire, bumpers switch weapon, Start pauses, Select toggles music). Each stage and boss fight has its own synthesized soundtrack. Progress (cleared sectors and best times) is saved in the browser's localStorage.

## Run it

Open `index.html` in a browser, or enable GitHub Pages for this repo (Settings → Pages → deploy from `main`, root).

On GitHub Pages it is an installable app: the manifest and service worker (`sw.js`) let you add it to a home screen or desktop and play offline. When you change `index.html`, bump `VERSION` in `sw.js` so installed copies pick up the update.

## Code layout

Classic scripts loaded in order from `index.html` (not ES modules, so opening the file directly still works). They share one global scope, so later files can use anything defined earlier.

| File | What's in it |
|---|---|
| `js/core.js` | canvas setup, colours, weapons, stage data, boss roster |
| `js/world.js` | saved progress, options, map building, collision physics |
| `js/input.js` | keyboard, touch pad, pointer |
| `js/audio.js` | sound effects, synthesized soundtrack, gamepad polling |
| `js/entities.js` | run state, player, platforms, crushers, wind, enemies |
| `js/bosses.js` | the four bosses and stage-clear handling |
| `js/step.js` | projectiles, pickups, particles, the per-frame step |
| `js/render.js` | all drawing, HUD and menus |
| `js/editor.js` | level editor and level codes |
| `js/main.js` | starts the loop, registers the service worker |
