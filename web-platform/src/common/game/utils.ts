import { Nullable } from '@noice-com/utils';

export const getGameIdFromGameCreatorsParam = (gameCreators?: Nullable<string>) =>
  gameCreators?.match(/([\w-]*)-creators/)?.[1];
