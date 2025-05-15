# StatStack Lite

A modern, mobile-first web game where players test their NFL knowledge by matching quarterbacks to teams and accumulating their career wins.

## Core Game Mechanics

- **20 Rounds**: Each round presents a random NFL team
- **QB Selection**: Name quarterbacks who played for the displayed team
- **Scoring**: Earn points based on the QB's total career wins across all teams
- **No Repeats**: Each QB can only be used once per game
- **Goal**: Aim for 2,500+ total career wins to achieve GOAT status

## Game Modes

### Easy Mode
- Available QBs are displayed in a grid
- Select from valid options for the current team
- Full points awarded for each pick
- Perfect for learning or casual play

### Standard Mode
- Type QB names manually
- Use "help" feature for assistance (50% point penalty)
- Long-press input for QB suggestions
- More challenging, strategic gameplay

## Special Features

- **Help System**: Type "help" or long-press for QB suggestions (Standard Mode)
- **Brady Effect**: Special animation for Tom Brady picks
- **Halftime Show**: Special effect at round 10
- **Mobile-First**: Optimized for small screens with no scrolling during gameplay
- **Dark Mode**: Automatic theme switching based on system preferences

## Technical Stack

- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Zustand for state management
- Firebase for deployment and leaderboards

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Deploy to Firebase:
   ```bash
   npm run deploy
   ```

## Design Principles

- **Mobile-First**: All layouts prioritize small screen proportions
- **Single-Screen UX**: Core gameplay elements fit without scrolling
- **Minimalist Style**: Clean, NYT Games-inspired design
- **Protected Logic**: Score calculations and game mechanics are carefully preserved

## Contributing

When contributing, please follow these guidelines:
1. Maintain mobile-first design principles
2. Ensure all gameplay fits on a single screen
3. Keep the minimalist aesthetic
4. Don't modify core gameplay logic without discussion
5. Test on both mobile and desktop devices

## Live Demo

Visit [https://statstack-lite.web.app](https://statstack-lite.web.app) to play the game. 