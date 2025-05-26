# StatStack Refactor

## Overview
This is a refactored version of the StatStack sports trivia app, focusing on a modular, scalable architecture that supports multiple game types. The refactor is based on the stable v5.15 baseline.

## Architecture

### Core Components
- `src/engine/GameEngine.ts`: Base interface for all game engines
- `src/games/qb-wins/`: QB Wins game implementation
  - `QBGameEngine.ts`: Game logic implementation
  - `QBGame.tsx`: React component
  - `qbData.ts`: QB database
  - `teamSelection.ts`: Team selection logic

### State Management
- Uses Zustand for state management
- Game state is centralized in `src/store/gameStore.ts`
- Each game type can extend the base game state

### Routing
- `/game/qb-wins`: QB Wins Challenge
- More game routes to be added as new games are implemented

## Development

### Setup
1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

### Adding New Games
1. Create a new directory under `src/games/`
2. Implement the game engine using the `GameEngine` interface
3. Create the game component
4. Add the route in `App.tsx`

## Refactor Goals
- [x] Decouple UI from game logic
- [x] Create reusable game engine interface
- [x] Isolate QB game implementation
- [ ] Add more game types
- [ ] Implement leaderboard integration
- [ ] Add game-specific analytics

## Contributing
1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License
MIT
