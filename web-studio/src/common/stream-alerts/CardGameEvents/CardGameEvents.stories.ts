// eslint-disable-next-line no-restricted-imports
import { getNewGraphQLGameCard } from '@noice-com/card-game/src/story-helpers';

import { CardGameEvents } from './CardGameEvents';

import { AlertsList } from '@common/alerts';

export default {
  component: CardGameEvents,
  argTypes: {},
  title: 'Stream Alerts/CardGameEvents',
};

const baseAlert = {
  id: 'test-alert-1',
  maxAmount: 100,
  keepLast: false,
  priority: 1,
};

const baseAlertData = {
  timestamp: new Date().getTime().toString(),
  id: 'test-alert-1',
};

const baseUserData = {
  userId: 'test-user-id-1',
  userTag: 'Teppo Testaaja',
  avatars: {
    avatar2D: 'https://metalshockfinland.files.wordpress.com/2022/07/angus-mcsix.jpg',
    avatarFullbody:
      'https://media-cdn.gcp.stg.noice.com/avatar/image_body_img/c5cec837-1e2a-5b5d-af8c-55f6d85e85f6/b035c77d-b61f-4440-9731-6be3be2c56c6.png',
  },
};

const mostPredictedCard: AlertsList = [
  {
    ...baseAlert,
    duration: 2200,
    data: {
      ...baseAlertData,
      __typename: 'MatchTopCardsUpdateCardCountUpdate',
      cards: [
        {
          __typename: 'MatchCardCount',
          cardId: 'test-card-1',
          count: 1,
          card: {
            ...getNewGraphQLGameCard(),
          },
        },
      ],
    },
  },
];

const highScoringCard: AlertsList = [
  {
    ...baseAlert,
    duration: 5000,
    data: {
      ...baseAlertData,
      __typename: 'StreamerChannelActivityEvent',
      content: {
        __typename: 'GameLogicHighScoringCardPromotedMsg',
        hscPlayer: {
          ...baseUserData,
        },
        card: {
          cardId: 'test-card-1',
          points: 1234,
          boosterPoints: [],
          card: {
            ...getNewGraphQLGameCard(),
          },
        },
      },
    },
  },
];

export const MostPredictedCard = {
  args: {
    alerts: mostPredictedCard,
  },
};

export const HighScoringCardCard = {
  args: {
    alerts: highScoringCard,
  },
};
