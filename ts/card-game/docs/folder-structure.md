# Card game folder structure

The folder structure was initially discussed through the [rfc](https://github.com/noice-com/rfcs/blob/main/text/0041-file-structure-conventions.md), so check that one out for more information.

The game structure follows very closely to the same principles and patterns as the platform app package, but with its own version to meet its specific needs and structure. In card game we have the similar types of folders under `src` like `legacy`, `common` & `context` as in app, but instead of pages folder the entry point components are directly under `src` (in the example below `ActiveMatch`, `MatchWaiting` and `MatchPaused`).


```
├── legacy 
│   └── ActiveMatch
├── common 
│   └── booster // @common/booster
│       └── Booster
│           └── Booster.module.css
│           └── Booster.stories.tsx
│           └── Booster.tsx
│           └── index.ts
│       └── index.ts
│   └── localstorage // @common/localstorage
│       └── hooks
│           └── useLocalStorage.hook.ts
│           └── index.ts
│       └── index.ts
│   └── sound // @common/sound
│       └── hooks
│           └── usePlaySounds.hook.ts
│           └── index.ts
│       └── index.ts
├── context // @game-context
│   └── SomeProvider.tsx
│   └── index.ts
├── DebugView  // entry point
├── MatchWaiting // entry point
│   └── MatchWaiting.tsx
│   └── index.ts
├── MatchPaused // entry point
│   └── MatchPaused.tsx
│   └── index.ts
├── ActiveMatch // entry point
│   └── CardRow
│   │   └── CardRowCard
│   │   │   └── CardRowCard.tsx
│   │   │   └── index.ts
│   │   └── CardRow.tsx
│   │   └── index.ts
│   └── ActiveMatch.tsx
│   └── index.ts
├── game-logic
│   └── player // @game-logic/player
│       └── __test__
│       └── hooks
│       └── types.ts
│       └─- CGPlayer.ts
│       └─- index.ts
│   └── card // @game-logic/card
│   └── booster // @game-logic/booster
│       └── hooks
│       └── mocks
│       └── types.ts
│       └─- AvailableBooster.ts
│       └─- ActiveBooster.ts
│       └─- index.ts
└── variables.css
└── index.ts // define package exports here and keep it minimal
```

#### `legacy`, `common` & `context`

Follows exactly the same idea and structure as used in `Platform Base` (check the rfc). 