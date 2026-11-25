# Voltline

A vector-graphics action platformer that runs in the browser, one self-contained `index.html` with no build step and no dependencies.

Pick one of three sectors, fight through to its warden, and take the boss's weapon. Each warden is weak to another warden's weapon. Clear all three and the Null Core fortress opens, ending in a two-phase fight with the Null Engine.

| Sector | Boss | Hazards | Weapon earned |
|---|---|---|---|
| Prism Grid | Prism Warden | spikes, ladder wall, slide tunnel | Prism Spread (3-way fan) |
| Coil Foundry | Coil Hound | conveyors, crushers, lava | Arc Bolt (bouncing lob) |
| Sky Relay | Gale Kite | moving platforms, headwind gusts | Gust Ring (orbit shield, throwable) |
| Null Core (final) | Null Engine | everything above, combined | — |

## Controls

| Action | Keys |
|---|---|
| Move | ← → or A D |
| Ladders | ↑ ↓ |
| Jump | Z, K or Space (hold for higher) |
| Fire | X or J (hold Volt Buster to charge) |
| Slide | ↓ + Jump |
| Switch weapon | Q / E |
| Start / pause | Enter |

Touch controls appear automatically on phones and tablets. Progress (cleared sectors and best times) is saved in the browser's localStorage.

## Run it

Open `index.html` in a browser, or enable GitHub Pages for this repo (Settings → Pages → deploy from `main`, root).
