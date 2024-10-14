# Game logic

This folder contains the classes managing the game state of the card game. For info on how to consume it, check out the [Game State Management](../../docs/game-state-management.md) docs.

## Quick overview of structure

This folder follows the following directory structure pattern:

```
[entity-name]
  ├── __tests__
  │   └── [entity-classes].tests.ts
  ├── context
  │   └── index.ts
  ├── hooks
  │   └── index.ts
  ├── [entity-classes].ts
  └── index.ts
```

These are importable via the following aliases:

- `@game-logic/[entity-name]/*.ts` - Top level classes.
- `@game-logic/[entity-name]/hooks` - The hooks for this entity.
- `@game-logic/[entity-name]/context` - Any available contexts for this entity.

## Current structure

- [`game/`](./game/) - Main card game implementation classes.
- [`boosters/`](./boosters/) - Instance implementations for both active + available boosters.
- [`card/`](./card/) - Instance implementation for active cards.
- [`group/`](./group/) - Instance implementation for groups/teams.
- [`player/`](./player/) - Instance implementation for players.
- [`systems/`](./systems/) - Specialized classes managing specific, more global features that are not specific to a single entity (for ex. team cheer, high scoring cards, etc.).
- [`timer/`](./timer/) - Timer utility class for better managing timed game content.
- [`events/`](./events/) - Helper classes for handling, managing, and forwarding events.
