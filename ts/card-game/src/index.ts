// To-be-moved
export { DebugView } from './DebugView';

// Entry points
// @todo needs re-evaluating if all card-game's responsibility
export { CardGame } from './CardGame';
export { GameCard, mockGameCard } from './GameCard';
export type { GameCardProps } from './GameCard';
export { Leaderboard, LeaderboardItem } from './Leaderboard';
export { withHideableFallback } from './ErrorFallback';

export { useLeaderboardGroups } from './common/leaderboard';

export * from './game-logic/game/hooks';
export * from './game-logic/player/hooks';
export * from './game-logic/group/hooks';
export * from './game-logic/card/hooks';
export type { CardGameOnTeamMergeWarningReceived } from './game-logic/game';
export type { CGPlayerOnInactivityWarning } from './game-logic/player';

// New API
export type {
  StreamGameProviderContext,
  JoinGameOptions,
  LeaveGameOptions,
} from './game-logic/game/context';
export {
  useCardGameState,
  useStreamGame,
  StreamGameProvider,
} from './game-logic/game/context';

export { useIsChallengesEnabled } from './game-logic/challenges/hooks';

export {
  NotificationsProvider,
  CardGameAPIProvider,
  MockCardGameUIGameStateProvider,
  MockLeaderboardProvider,
  LeaderboardProvider,
  useCardGameAPI,
  useNotifications,
  useLeaderboards,
} from './context';
export type { NotificationItem } from './context';
export { rarityBackgroundName } from './constants';
export { Booster } from './common/booster';
export {
  useCardTransforms,
  useIsMouseLeavingCard,
  useMousePositionOnCard,
  parseDescription,
} from './common/card';

// local & session storage
export type { GameLocalStorageKeys, GameSessionDataKeys } from './types';
// boosters
export type { ActivatedBooster } from './types';
// group event
export type { GroupEventMessage, GroupEventContentTypeMap } from './types';
// leaderboard
export type { GroupProps, LeaderboardGroup } from './types';
// enums
export { GameSoundKeys, GroupEventContentType, BoosterType } from './types';

export { addDebugListener, convertRarityRarityToRarity } from './utils';

export * as GameStoryHelpers from './story-helpers';

export * as CardGameAssets from './assets';

export { parseChallengeDescription } from './common/challenges';
