# Voltline · fact sheet

| | |
|---|---|
| **What** | A vector-graphics action platformer in the browser: run, jump, slide and shoot through six sectors, beat each warden and take its weapon. |
| **Developer** | Jeremy Anderson ([CptNope](https://github.com/CptNope)) |
| **Play** | https://cptnope.github.io/Voltline/ (desktop and mobile browsers; installable, works offline) |
| **Source** | https://github.com/CptNope/Voltline |
| **Price** | Free |
| **License** | MIT (code and art). Font: Chakra Petch, SIL Open Font License. |
| **Release** | Version 0.20 now; 1.0 after the first round of playtests |
| **Size** | About 600 KB in total, fonts and icons included (the code is about 73 KB gzipped). No third-party requests, no tracking, no account. |
| **Tech** | Plain HTML, canvas and the Web Audio API. No engine, no build step, no external libraries. Every sound and note is synthesised; every shape is drawn in code. |

## The game

The Grid went dark in a single night. Six wardens still run their sectors, and at the centre the Null Engine waits. Kestrel, a maintenance unit with a spare core and a stubborn streak, powers on.

- **Seven stages:** Prism Grid, Coil Foundry, Sky Relay, Tide Vault, Orbit Deck, Phase Lab, then the Null Core.
- **Seven bosses and six mid-bosses.** Every warden drops its weapon, and every weapon is one warden's weakness, in one closed loop.
- **Seven weapons:** Volt Buster (with a charge shot), Prism Spread, Arc Bolt, Gust Ring, Tide Lance, Orbit Disc and Echo Shot.
- **Mechanics:** conveyor belts, crushers, wind gusts, moving platforms, swimming, low-gravity fields and blocks that switch on and off to the beat.
- **Modes:** Boss Rush; 20 challenge rooms with gold, silver and bronze times; a Daily run that's the same for everyone; an Endless run against an advancing wall of static; Practice from any checkpoint or boss.
- **Ghost replays** of your best run in every sector and room.
- **Level editor** with shareable level codes and play links, plus a gallery of ten ready-made levels.
- **21 achievements**, best times, splits and a Hard mode.
- **Accessibility:** remappable keys and gamepad buttons, touch controls, assist modes (half damage or invincible), 75% and 50% game speed, high-contrast palette (checked against colour-blindness simulations), large text, reduced flashing, toggle charge, auto-fire, hold-to-slide, and a graphics setting that adapts to slower phones.

## Controls

| Action | Keyboard | Gamepad | Touch |
|---|---|---|---|
| Move / climb | arrows or WASD | D-pad or left stick | on-screen pad |
| Jump (hold for higher) | Z, K or Space | A | JUMP |
| Fire (hold to charge) | X or J | B or X | FIRE |
| Slide | Down + Jump | Down + A | ▼ + JUMP |
| Switch weapon | Q / E | LB / RB | WPN |
| Pause | Enter, P or Esc | Start | START |

## Facts you can check

Every built-in stage, challenge room and Endless chunk is checked by an automated route finder on every change, and challenge-room gold times are set from that finder's own time. The smoke suite runs about 200 gameplay checks in CI.
