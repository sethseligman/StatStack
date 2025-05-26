# ARCHIVE Directory

This directory contains old/unused files that were part of the application but are no longer actively used. These files are kept for reference purposes rather than being immediately deleted.

## Archived Files

1. `Game.tsx` - Old version of the game component that was originally in the components directory. The active version is now in `src/pages/Game.tsx`.
2. `LobbyPage.tsx` - Duplicate of the lobby page component. The active version is in `src/pages/LobbyPage.tsx`.
3. `ScoreHistory.tsx` - Unused component for displaying game history. Was likely intended for a feature to show player's previous games.
4. `LandingScreen.tsx` - Old landing page component that included multiple game options (NFL, NBA, MLB). Not used in the current single-game version.
5. `GameCard.tsx` - Component for displaying game options in a card format. Was used with the old landing page but no longer needed.

## Why Keep These Files?

These files are kept for:
- Historical reference
- Potential code recovery if needed
- Understanding previous implementations
- Future feature inspiration (e.g., the multi-game selection UI could be useful if we expand)

## Note

If you're certain these files are no longer needed, they can be safely deleted. Please update this README if any files are added to or removed from the ARCHIVE.

## Active Components

For reference, the main active components are:
- `src/pages/Game.tsx` - Main game component
- `src/pages/LobbyPage.tsx` - Current lobby page
- `src/pages/Leaderboard.tsx` - Leaderboard page
- `src/components/RulesModal.tsx` - Game rules modal
- `src/components/LeaderboardModal.tsx` - End-game leaderboard entry
- `src/components/SpecialEffects.tsx` - Special effects (Brady effect)
- `src/components/AppLayout.tsx` - Main app layout wrapper 