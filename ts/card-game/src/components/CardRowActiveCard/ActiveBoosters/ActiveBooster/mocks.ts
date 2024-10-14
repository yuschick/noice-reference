import { StoryHelpers } from '@noice-com/common-ui';

import {
  mockActiveBoostersData,
  mockActiveBoostersProfileData,
} from './mocks/story-mocks';

interface MockProps {
  boosterId?: number;
  playerId: string;
}

export const mockActiveBooster = ({
  boosterId,
  playerId,
}: MockProps): StoryHelpers.Apollo.GraphqlMock[] => [
  ...(boosterId ? [mockActiveBoostersData(boosterId)] : []),
  mockActiveBoostersProfileData(playerId),
];
