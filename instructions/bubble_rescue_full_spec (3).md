# Bubble Rescue 🫧🧚‍♀️🦋 — FULL GAME SPEC (Build + Launch Plan)

---

# 1. Game Vision
A calming, addictive mobile game where players free cute creatures trapped inside floating bubbles.

Core pillars:
- Simple (one tap)
- Satisfying (visual + audio feedback)
- Emotional (rescue, not destroy)
- Shareable (TikTok-friendly moments)

---

# 2. Core Gameplay

## Loop
1. Bubbles spawn with creatures
2. Player taps to free them
3. Creatures animate out
4. Score + combo increases
5. Difficulty increases
6. Game ends on mistake or overload

Session target: 20–60 seconds

---

# 3. Game Mechanics

## Bubble Behaviour
- Float with physics (slow drift + bounce)
- Spawn rate increases over time
- Size varies

## Types
- Normal: +1 score
- Bonus: +3 / slow motion
- Danger: fail on tap
- Timed: must pop quickly

## Combo System
- 3 streak = x2
- 6 streak = x3
- Visual glow increases

---

# 4. Creatures System

## Common
- Butterfly 🦋
- Bird 🐦
- Firefly ✨

## Rare
- Fairy 🧚
- Baby dragon 🐉
- Spirit 🌙

## Behaviour
- Unique exit animations
- Particle trails
- Sound effects

---

# 5. Visual & Audio Design

## Style
- Pastel gradients
- Soft glow
- Dreamy backgrounds

## Effects
- Pop ripple
- Sparkles
- Screen shake (light)

## Audio
- Soft pop sounds
- Magical chimes
- Calm background music

---

# 6. UI/UX

## Home
- Tap to Start
- High Score
- Collection

## Game
- Floating bubbles
- Score top center
- Combo indicator

## Game Over
- Score
- Best score
- Retry
- Watch Ad (revive)

---

# 7. Progression

## Collection System
- Creature gallery
- Unlock by gameplay

## Worlds
- Sky
- Forest
- Ocean
- Night

## Cosmetics
- Bubble skins
- Backgrounds
- Effects

---

# 8. Monetisation

## Ads
- Rewarded: revive, bonus rewards
- Interstitial: every 2–3 runs

## IAP
- Remove ads (£1.99–£2.99)
- Cosmetic packs (£0.99–£4.99)

## Strategy
- Never interrupt gameplay
- Reward-based monetisation first

---

# 9. TikTok Viral Strategy

## Hooks
- “Saving cute creatures” clips
- Perfect combo streaks
- Rare creature reveals

## Content Ideas
- Before/after collection
- Speed popping challenges
- “Most satisfying pops”

## Design for sharing
- Bright visuals
- Quick action (3–10 sec clips)
- Big combo moments

---

# 10. Technical Architecture (Unity Recommended)

## Core Systems
- GameManager
- BubbleSpawner
- BubbleController
- InputHandler
- ScoreManager
- UIManager

## Logic Example
- OnTap → Raycast → Check bubble
- If normal → pop + score
- If danger → game over

## Physics
- Rigidbody2D + low gravity
- Random movement vectors

---

# 11. Build Plan

## Phase 1 (MVP)
- Bubble spawn
- Tap detection
- Score system

## Phase 2
- Creatures
- Effects
- Sound

## Phase 3
- UI polish
- Monetisation

---

# 12. Deployment Plan

## Android (Google Play)
- Create developer account
- Build APK/AAB via Unity
- Upload assets + screenshots
- Add description + keywords

## iOS (Apple App Store)
- Apple Developer account
- Build via Xcode
- TestFlight testing
- Submit for review

---

# 13. ASO (App Store Optimisation)

## Keywords
- relaxing game
- cute game
- bubble pop
- calming game

## Screenshots
- Show creatures
- Show popping action
- Show collection

---

# 14. Analytics

Track:
- Retention (Day 1, 7)
- Session length
- Ad engagement
- Conversion to IAP

Tools:
- Firebase
- Unity Analytics

---

# 15. Future Expansion

- Multiplayer
- Events
- Seasonal themes
- Pets that follow player

---

# 16. AI Build Prompt (Use with AI tools)

“Create a mobile game in Unity where bubbles float around containing cute creatures. Player taps to free them. Include scoring, combo system, multiple bubble types (normal, bonus, danger), soft pastel visuals, particle effects, and monetisation via rewarded ads and cosmetic purchases. Optimise for short addictive sessions and satisfying feedback.”

---

# END
