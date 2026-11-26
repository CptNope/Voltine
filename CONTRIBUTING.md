# Contributing

Thanks for helping build Voltline. The project is small and has no tooling to install, so the main things to know are the rules that keep it that way.

## License

Voltline is [MIT licensed](LICENSE). By contributing, you agree that your contribution is released under the same license.

## Ground rules

1. **No build step and no dependencies.** If a change needs `npm install` to run the game, it doesn't belong here.
2. **Keep the scripts classic.** No `import` / `export`. The files share one global scope in the order set in `index.html`. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#load-order).
3. **Draw and synthesize; don't add asset files.** New visuals are canvas paths; new sounds are `snd()` calls or tracks in `TR`.
4. **Original content only.** Characters, music and designs must be original work, not lifted or recognisable recreations of characters, sprites or tunes from other games.
5. **Terrain stays the brightest layer.** Backgrounds are dim and unlit, so players can always tell what's solid.

## Workflow

1. Run the game locally: `python3 -m http.server 8000`, then open `http://localhost:8000`.
2. Make your change.
3. Run the checks:
   ```sh
   node tools/smoke.js
   node tools/ghost.js
   ```
   Both need to pass. If you changed a stage, `ghost.js` tells you how far its search got if a jump is now impossible.
4. Play the part you changed yourself, on a keyboard and ideally on a phone. The tools prove things *work*, not that they *feel* right.
5. Bump `VERSION` in `sw.js`.
6. Add a line to [CHANGELOG.md](CHANGELOG.md), and tick off or add items in [ROADMAP.md](ROADMAP.md). New items need a size (S/M/L) and a "done when" check.
7. Commit with a message that says what changed and why.

## Adding a gallery level

1. Build your level in the editor. Give it a **name** and an **author**.
2. Press **Check route** until it passes. The editor shows *Route verified*.
3. Press **Copy code** and add an entry to `levels.json`:
   ```json
   { "code": "VL1.…" }
   ```
4. Run `node tools/check-gallery.js`. It decodes every level, checks the verified mark, rejects duplicates, and re-runs the route search. CI runs the same check on every pull request.
5. Open a pull request, and include a screenshot or short clip of the hardest part.

Levels by the project itself are written as recipes in `tools/build-gallery.js`. Running `node tools/build-gallery.js` rebuilds `levels.json` from those recipes, but only if every recipe passes the route check. If you add a recipe there, keep community levels by also re-adding their entries.

**What makes a good gallery level:** a clear idea (one mechanic explored well beats everything at once), a fair first look at each hazard before it gets hard, a checkpoint at least every 50 columns, and a boss and theme that match its mood.

## Code style

- Match the surrounding code: compact, two-space indent, short names inside hot loops, descriptive names for anything other files use.
- Wrap browser storage, audio and clipboard calls in try/catch. They fail in private browsing and sandboxed frames, and the game must keep running.
- Anything from outside (level codes, `localStorage`) is data. Validate it, and never insert it into the page as HTML.
- Game logic uses frames, never wall-clock time.

## Reporting balance problems

When something feels too hard or unfair, the most useful report says **where** (stage and roughly where in it, or the boss and its attack), **what happened**, and **on which difficulty**. A short screen recording helps a lot.
