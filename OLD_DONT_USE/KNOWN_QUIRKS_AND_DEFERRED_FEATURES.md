# 🧩 Known Quirks & Deferred Features — v5.15 (StatStack Lite)

This file documents unfinished, commented-out, or deferred parts of the StatStack Lite 5.15 build. It acts as a reference during the upcoming refactor and future polish phases.

---

## 🏆 Leaderboard System (Partially Implemented)

### ✅ Backend Functionality (Complete)
- `leaderboardStore.ts` includes:
  - `addScoreRecord(gameRecord)`
  - `getTop10Scores()`
  - `getGameRecordById(id)`
  - `resetLeaderboard()`

### ❌ UI Integration (Deferred)
- Leaderboard modal logic is commented out in `Game.tsx`.
- Score submission at Game Over is not wired up.
- Post-game leaderboard summary does not appear.
- CTA (Call-to-Action) for leaderboard is disabled or not rendered.

---

## 🎮 Gameplay Logic & Scoring

### ✅ Core Mechanics
- Game plays over 20 rounds.
- Each round shows a team; user picks a QB.
- Scoring updates correctly via `calculateScore()`.

### 🧪 Commented-Out/Deferred Enhancements
- Scoring logic included plans to:
  - Prioritize QBs who appear on more future teams.
  - Break ties by total wins or frequency.
- These enhancements are commented out in the engine config.

---

## 🧠 UX & Navigation Quirks

### 🌀 "New Game" Flow Issue
- When the user is midgame and opens the 3-dot menu → **"New Game"**:
  - ✅ Intro/Game Modal correctly appears
  - ❌ If user resumes, the team shuffler resets instead of resuming the original team like a page refresh would

---

## 📌 Summary

| Area         | Status              | Notes |
|--------------|---------------------|-------|
| Core Gameplay | ✅ Stable & working | 20 rounds, score updates, picks flow correctly |
| Leaderboard UI | ❌ Not wired in UI | Functional backend, no front-end integration |
| Scoring Enhancements | 🔒 Deferred | Logic partially written, commented out |
| UX Quirks | 🟡 Minor | Only one known glitch on modal resume |

---

## 🔒 Intentions for Refactor
- Freeze this version as the **baseline reference**.
- Refactor should aim to **replicate this exact behavior** before adding new features.
- Use this file to identify what can be added or fixed **after parity is achieved**.

