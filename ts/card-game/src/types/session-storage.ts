import { CommonSessionDataKeys } from '@noice-com/common-ui';

export interface GameSessionDataKeys extends CommonSessionDataKeys {
  'gameStream.active.streamId': string;
  'gameStream.active.isSoloPlay': boolean;
}
