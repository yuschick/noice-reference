# Card Game State Management

This page goes through a general overview of how we manage the game instance for the current active card game in the Noice platform. 

## Important Files

### `@noice-com/card-game`

- [`src/game-logic`](../src/game-logic/) - Folder of all game state logic.
- [`src/game-logic/game/CardGame`](../src/game-logic/game/CardGame.ts) - Main class managing incoming state for the card game.
- [`src/game-logic/game/context/StreamGameProvider/StreamGameProvider.tsx`](../src/game-logic/game/context/StreamGameProvider/StreamGameProvider.tsx) - Main React component managing the current card game instance, and API for interacting with it.

### `@noice-com/web-app`

- [`src/page/PageLayout`](../../app/src/page/PageLayout) - Main layout component that houses the views injecting the game.
- [`src/page/PageLayout/PageLayout/GameView`](../../app/src/page/PageLayout/PageLayout/GameView/) - Main component wrapping the `CardGame`.
- [`src/page/PageLayout/SpectatorPageLayout/SpectatorGameView`](../../app/src/page/PageLayout/SpectatorPageLayout/SpectatorGameView/) - Main component wrapping the spectator mode of the `CardGame`.

## General Flow

Our current game state management aims to streamline the flow of joining and leaving games, along with changing teams. We try to have everything stored and managed in one place so that it is easy to see if a game is active, and to prevent the possibility of race conditions occurring.

### Example Flow: Joining game

1. Somewhere in the app needs to join the game.
2. The API is imported via [`useStreamGame`](../src/game-logic/game/context/StreamGameProvider/StreamGameProvider.tsx) and consumed.

```tsx
import { useStreamGame } from '@noice-com/card-game';

interface Props {
  streamId: string;
  isSolo: boolean;
}
function PlayButton({ streamId, isSolo }: Props) {
  const { joinGame } = useStreamGame();

  return (
    <button onClick={() => joinGame(streamId, isSolo)}>
      Join Game
    </button>
  );
}
```

1. Internally, the hook runs the following flow:
    1. Requests a group ID from the match making service (`client.MatchMakingService.findMatchGroup`)
    2. Creates instance of [`CardGame`](../src/game-logic/game/CardGame.ts)
    3. Requests to join the group ID (`client.MatchService.joinMatchGroup`)
    4. Updates local storage to indicate we have joined a game
    5. All important info from the above calls gets stored together in the hooks internal state.
    6. If there is an error at any point in the flow, it will instead store the error.
2. Once React re-renders, the game instance will be available and the app can assume that we are connected to and playing the game. 

```tsx
import { useStreamGame, CardGame } from '@noice-com/card-game';

function GameView() {
  const { gameInstance, gameError } = useStreamGame();

  return (
    <div>
      {gameError && (<div>Could not connect to game: {gameError}</div>)}
      {gameInstance && (<CardGame />)}
    </div>
  );
}
```

<aside>
💡 The goal of this pattern is to prevent side-effects involved in the match making process. As everything happens in one place in one function, there are no re-renders until *something* has happened; so once the re-render happens you can safely assume you have the exact state and that it will not change.
</aside>

## Extra Info

While all flows are essentially the same and everything is handled in the hook, there are some gotcha’s that everyone should be aware of.

### API’s have side-effects

One thing that may not be obvious is that the backend API’s for changing teams / parties handle quite a lot for us so some of the API’s might have side effects you will not expect, and the flows are a bit more straight-forward for us on the client because some key actions are already being handled for us.

- `Client.MatchMakingService.changeTeam(streamId, isSolo)` WILL remove you from your current group and reserve your spot in the next group, so there is no need for the client to close the connection or call `Client.MatchService.leaveActiveGroup()`. After using `changeTeam` to get the new group ID, we can instantly just request to join it.
- Changing parties is similar, where joining the party (or creating one) automatically removes you from your current group on the backend, so you do not need to close the connection or request to leave the active group; just joining the ID that the match making service gives us is enough.

### Spectator mode is a lil’ special

Spectator mode is not like the normal flows, and if we try to treat it like the other flows we will get nothing but errors. To combat this, we are handling the spectator mode completely separately and have a separate internal hook for managing the spectator state. When there is a state update, the Provider will look to see if it is a spectator state or a normal state and use whichever one is initialised. Here are some gotchas:

- Spectator mode uses a different service altogether for obtaining the group ID’s to spectate; so the Match service will error out if you try to use it directly with spectator mode.
- The service giving spectator group ID’s can do so at times that are not really ideal for a good user experience (for example, in the middle of match end). To fix this, we have a boolean that we set whenever some sort of cinematic event is happening, like match end, and we cache the new group ID until that boolean is false; that way we can have better control over when the group changes.