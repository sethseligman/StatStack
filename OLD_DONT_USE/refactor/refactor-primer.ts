/**
 * 🧭 Refactor Primer: StatStack Next
 * Created: May 2025
 *
 * This file defines the goals, structure, and rules for refactoring StatStack.
 * Cursor and contributors should refer to this file to maintain consistency.
 */

export const REFRACTOR_PRIMER = {
    version: 'v5.15',
    purpose: 'Restructure game architecture for scalability and new game modules.',
    baseline: 'Current implementation is feature-complete (v5.15) and will serve as the reference for all UX/functionality during refactor.',
    keep: [
      'Game flow and UX from 5.15',
      'Custom on-screen keyboard',
      'Persistent state using Zustand + localStorage',
      'Clean animations on team transitions',
    ],
    goals: [
      'Modularize game engine and scoring logic',
      'Create reusable types and config interfaces for multiple sports',
      'Separate Game UI from game logic (clean architecture)',
      'Maintain parity with 5.15 at each step',
    ],
    avoid: [
      'Over-abstraction before second game is added',
      'Losing keyboard UX or animation quality from 5.15',
    ],
    status: {
      refactorProgress: 'Beginning with clean baseline',
      sourceOfTruth: 'https://statstack-lite.web.app',
    },
    notes: 'Do not remove working features like keyboard input. Instead, relocate and rewire them as needed.',
  };
  