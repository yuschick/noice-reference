import { ChannelLiveStatus } from '@gen';

export interface StreamConfig {
  gameId: string;
  id: string;
}

export enum StreamError {
  ServerError = 'SERVER_ERROR',
  NetworkError = 'NETWORK_ERROR',
}

export type StreamStatus = ChannelLiveStatus | StreamError;
