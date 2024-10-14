import { CoreAssets } from '@noice-com/assets-core';
import { StoryHelpers } from '@noice-com/common-ui';

import {
  ChannelChannel,
  GameLogicCard,
  GameSeason,
  GameStateCardTargetValuesFragment,
  RarityRarity,
} from '@game-gen';

// eslint-disable-next-line @typescript-eslint/naming-convention
const TestVideoPlaceholder = CoreAssets.Images.CardFrame;
// eslint-disable-next-line @typescript-eslint/naming-convention
const StreamerLogo = CoreAssets.Images.StreamerLogo;
// eslint-disable-next-line @typescript-eslint/naming-convention
const TestVideo = CoreAssets.Videos.VideoFull;
// eslint-disable-next-line @typescript-eslint/naming-convention
const TestFaceCameraVideo = CoreAssets.Videos.VideoStreamer;

export const defaultStreamerCard = {
  video: TestVideo,
  videoPlaceholder: TestVideoPlaceholder,
  faceCameraVideo: TestFaceCameraVideo,
  streamerLogo: StreamerLogo,
  streamerName: 'Matti',
};

export const DEFAULT_SEASON_ID = 'fortnite';
export const DEFAULT_SEASON_BADGE_URL = `${NOICE.CDN_URL}/season-badges/fortnite/example_season_badge_v2.png`;

/// GraphQL related helpers

export type GameCard = Omit<GameLogicCard, '__typename' | 'targetValues'> & {
  __typename: 'GameLogicCard';
  targetValues: GameStateCardTargetValuesFragment['targetValues'];
};
type GameStreamerCard = Omit<ReturnType<typeof makeGraphQLStreamerCard>, '__typename'>;

export const cardBackgroundUrls = [
  {
    rarity: RarityRarity.RarityCommon,
    url: `${NOICE.CDN_URL}/card-backgrounds/fortnite/season_zero/common.png`,
  },
  {
    rarity: RarityRarity.RarityEpic,
    url: `${NOICE.CDN_URL}/card-backgrounds/fortnite/season_zero/epic.png`,
  },
  {
    rarity: RarityRarity.RarityLegendary,
    url: `${NOICE.CDN_URL}/card-backgrounds/fortnite/season_zero/legendary.png`,
  },
  {
    rarity: RarityRarity.RarityRare,
    url: `${NOICE.CDN_URL}/card-backgrounds/fortnite/season_zero/rare.png`,
  },
  {
    rarity: RarityRarity.RarityUncommon,
    url: `${NOICE.CDN_URL}/card-backgrounds/fortnite/season_zero/uncommon.png`,
  },
];

// @todo this needs to be filled with all the necessary props with the actual fragment
const makeGraphQLGameCard = (
  progressToNextLevel: number,
  cardId: string,
  level: number,
  rarity: RarityRarity,
  name: string,
  description: string,
  icon: string,
  pointsMin = 95,
  pointsMax = 150,
  nextLevelLimit = 15,
  targetValues: GameStateCardTargetValuesFragment['targetValues'] = [],
): GameCard => {
  return {
    __typename: 'GameLogicCard',
    id: `${cardId}|${level}`,
    timerDuration: 0,
    activeStreamerCard: null,
    availableStreamerCards: [],
    activeStreamerCards: [],
    frontImage:
      'https://images.unsplash.com/photo-1528287942171-fbe365d1d9ac?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&w=1200&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ',
    backImage: '',
    dealingModules: [],
    description,
    failureModules: [],
    gameModes: [],
    icon,
    isAllOrNothing: false,
    isDealtAtStart: true,
    isEnabled: true,
    isMatchCard: false,
    leveling: {
      currentLevel: level,
      nextLevelLimit: nextLevelLimit,
      progressToNextLevel: progressToNextLevel,
    },
    matchCardId: -1,
    name,
    pointsMax,
    pointsMin,
    pointsTimeTarget: 60000,
    rarity,
    roleCharacters: [],
    scoredCounterIds: [],
    seasonId: DEFAULT_SEASON_ID,
    season: {
      id: DEFAULT_SEASON_ID,
      name: 'Fortnite',
      gameId: 'fortnite',
      cardBackgroundUrls,
    } as GameSeason,
    sides: [],
    successModules: [],
    targetValue: 0,
    failureTargetValue: 0,
    familyId: 'test-family',
    unlockLevel: 1,
    targetValues,
  };
};

export const makeGraphQLStreamerCard = (
  count: number,
  cardId: string,
  familyId: string,
  level: number,
  rarity: RarityRarity,
  name: string,
  description: string,
  icon: string,
) => {
  return {
    __typename: 'GameLogicStreamerCard',
    familyId: familyId,
    facecamUrl: TestFaceCameraVideo,
    id: 'streamerCard-1',
    channel: StoryHelpers.getNewChannel<ChannelChannel>(),
    // TODO: remove imageUrl once GameCard migration is complete
    imageUrl: StreamerLogo,
    image: StreamerLogo,
    channelId: 'Matti',
    // TODO: remove videoUrl once GameCard migration is complete
    videoUrl: TestVideo,
    video: TestVideo,
    baseCard: makeGraphQLGameCard(
      count,
      cardId,
      level,
      rarity,
      name,
      description,
      icon,
    ) as GameLogicCard,
  };
};

const graphqlGameCards = [
  makeGraphQLGameCard(
    2,
    '3',
    1,
    RarityRarity.RarityRare,
    '#Wood-gang',
    'Harvest wood',
    `${NOICE.CDN_URL}/card-hero-art/apex_legends/season_zero/heavy_score.png`,
  ),
  makeGraphQLGameCard(
    2,
    '5',
    3,
    RarityRarity.RarityUncommon,
    'Ratta-Tatta',
    'Next Knock/Elim is with an SMG',
    `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/shield_health_full.png`,
  ),
  makeGraphQLGameCard(
    1,
    '2',
    40,
    RarityRarity.RarityRare,
    'In My Sights',
    'Next Knock/Elim is with a Sniper Rifle',
    `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/use_fishing.png`,
  ),
  makeGraphQLGameCard(
    1,
    '7',
    32,
    RarityRarity.RarityCommon,
    'Heads Up',
    'Score a Headshot',
    `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/score_distance_medium.png`,
  ),
  makeGraphQLGameCard(
    1,
    '8',
    16,
    RarityRarity.RarityCommon,
    'Treasure Hunter',
    'Search 3 Chests',
    `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/shield_health_full.png`,
  ),
  makeGraphQLGameCard(
    1,
    '13',
    2,
    RarityRarity.RarityRare,
    'Unstoppable',
    '{{globals.teamNameHome|Home team}} scores the next {{goalValue}} goals',
    `${NOICE.CDN_URL}/card-hero-art/EAsports_FC24/season_zero/home_many_goals_next.png`,
    undefined,
    undefined,
    undefined,
    [{ label: 'goalValue', value: 2 }],
  ),
];

const graphqlGameStreamerCards = [
  makeGraphQLStreamerCard(
    2,
    '3',
    'test-family-1',
    1,
    RarityRarity.RarityRare,
    '#Wood-gang',
    'Harvest wood',
    `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/score_distance_medium.png`,
  ),
  makeGraphQLStreamerCard(
    2,
    '5',
    'test-family-1',
    3,
    RarityRarity.RarityUncommon,
    'Ratta-Tatta',
    'Next Knock/Elim is with an SMG',
    `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/score_distance_medium.png`,
  ),
  makeGraphQLStreamerCard(
    1,
    '2',
    'test-family-1',
    3,
    RarityRarity.RarityRare,
    'In My Sights',
    'Next Knock/Elim is with a Sniper Rifle',
    `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/score_distance_medium.png`,
  ),
  makeGraphQLStreamerCard(
    1,
    '7',
    'test-family-1',
    2,
    RarityRarity.RarityCommon,
    'Heads Up',
    'Score a Headshot',
    `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/score_distance_medium.png`,
  ),
  makeGraphQLStreamerCard(
    1,
    '8',
    'test-family-1',
    2,
    RarityRarity.RarityCommon,
    'Treasure Hunter',
    'Search 3 Chests',
    `${NOICE.CDN_URL}/card-hero-art/fortnite/season_zero/score_distance_medium.png`,
  ),
];

function* graphQLGameCardGenFn(): Generator<GameCard> {
  let index = 0;

  while (true) {
    yield graphqlGameCards[index++ % graphqlGameCards.length];
  }
}

function* graphQLGameStreamerCardGenFn(): Generator<GameStreamerCard> {
  let index = 0;

  while (true) {
    yield graphqlGameStreamerCards[index++ % graphqlGameStreamerCards.length];
  }
}

const graphQLGameCardGen = graphQLGameCardGenFn();
const graphQLGameStreamerCardGen = graphQLGameStreamerCardGenFn();

export const getNewGraphQLGameCard = (): GameCard => graphQLGameCardGen.next().value;

export const getNewGraphQLGameStreamerCard = (): GameStreamerCard =>
  graphQLGameStreamerCardGen.next().value;
