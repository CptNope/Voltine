# Playtesting Voltline

The automated checks prove the game *works*. Only people can tell us whether it's *fun*, *fair* and *clear*. This kit is for milestone 0.14 (see [ROADMAP.md](../ROADMAP.md#014--feel-and-first-playtest)).

## What we want from round 1

- **5 testers**, including at least one on a gamepad and one on a phone.
- Each plays for **20–30 minutes**, with no coaching for the first 10.
- From each tester: their **playtest report** (from the game), their answers to the questions below, and anything you noticed watching them.

## Setting up a tester

1. Send them the link: **https://cptnope.github.io/Voltline/**
2. Ask them to play on **Normal** with **assist off**, unless they ask for it. If they turn assist on, note it, because that's useful information too.
3. Don't explain the controls. The title screen and the strip under the game should be enough. If they get stuck for more than a minute, note where, then help.

## Watching a session

Write down, with a rough time:

| Watch for | Example note |
|---|---|
| The first moment of confusion | "1:40 didn't know Down + Jump slides; stuck at the tunnel for 50 s" |
| Deaths that surprised them ("what killed me?") | "Sky Relay: hit by a gull they never saw" |
| Things they said out loud | "'this jump is mean'", "'oh nice'" |
| Moments of boredom (sighing, checking a phone) | "Undertow fight felt long around 1:30 in" |
| Weapons they ignored | "never switched off the blaster" |
| Anything that looked broken | "camera jittered on the moving platform" |

## The playtest report

The game keeps a local log of deaths (where and what caused them), stage clears and boss-fight lengths. It never leaves the device unless the tester shares it.

To get it, scroll below the game, open **Move your progress, or share a playtest report**, and press **Copy playtest report**. The report looks like this:

```
Voltline playtest report · version 0.14 · 2026-11-25
Events logged: 23

Prism Grid: 1 clear (fastest 2:41), 6 deaths
  3 × columns 55-59 (3 spikes)
  2 × boss fight (PRISM WARDEN) (2 hit)
  1 × columns 140-144 (1 pit)
  boss PRISM WARDEN: 1 win, average fight 1:12, range 1:12-1:12
```

Ask testers to paste it into the same message as their answers.

## Questions to ask afterwards

1. What was the most fun moment?
2. Where did you feel the game was unfair? Why?
3. Was there anywhere you didn't know what to do or where to go?
4. Which boss was the hardest, and did you find its weakness?
5. Did the controls ever do something you didn't mean them to?
6. Was the music or sound ever annoying or too loud?
7. Would you play another sector? Why or why not?
8. One thing you'd change?

## Device checklist

Run once per device type. Tick when it works, or note what happened.

| Check | Android Chrome | iOS Safari | Desktop Chrome | Desktop Firefox |
|---|---|---|---|---|
| Game loads and the title screen shows | | | | |
| Touch pad appears (phones) / keyboard works (desktop) | | | | |
| A gamepad works (desktop) | n/a | n/a | | |
| Music and sound play after the first tap or key | | | | |
| Install to the home screen or desktop | | | | |
| Plays offline after installing (turn on airplane mode, open it) | | | | |
| Editor: paint and drag with a finger | | | n/a | n/a |
| Editor: Check route finishes | | | | |
| Progress code copies and loads on another device | | | | |
| Frame rate stays smooth in the Null Engine fight | | | | |

## Tuning targets

Use these to decide what to change after round 1.

| Measure | Target | If it's off |
|---|---|---|
| Boss fight length, using the weakness weapon | 45–120 s | Change boss health, idle time or attack frequency in `js/bosses.js` |
| Boss fight length, blaster only | under 3 min | Same as above |
| Deaths at one spot in a stage, across all testers | under 3 per tester | Widen the platform, add a checkpoint, or move the enemy (then run `node tools/ghost.js`) |
| Time to first clear of the first sector a tester picks | 3–8 min | Too long: trim length or ease the hard spots. Too short: fine for a first stage. |
| Testers who found at least one boss weakness on their own | 3 of 5 or more | Make the "WEAK!" feedback louder, or add a hint on the weapon-acquired screen |

## Results log

Add one section per round.

### Round 1 · *date*

| Tester | Device / input | Played | Clears | Notes |
|---|---|---|---|---|
| | | | | |

**Changes made because of this round:**
-
