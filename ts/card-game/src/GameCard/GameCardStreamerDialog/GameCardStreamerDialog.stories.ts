import { GameCardStreamerDialog } from './GameCardStreamerDialog';

import { getNewGraphQLGameStreamerCard } from '@game-story-helpers';

export default {
  title: 'GameCard/GameCardStreamerDialog',
  component: GameCardStreamerDialog,
};

export const Default = {
  args: {
    streamerCard: getNewGraphQLGameStreamerCard(),
    isOpen: true,
  },
};
