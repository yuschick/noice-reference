import {
  AlertsChannelActivityEventFragment,
  AlertsTopPredictionsUpdateFragment,
} from '@gen';

export interface AlertBaseProps {
  id: string;
  // When you add more data types, make sure it has a __typename
  data: AlertsTopPredictionsUpdateFragment | AlertsChannelActivityEventFragment;
}

export interface AlertProps extends AlertBaseProps {
  maxAmount: number;
  keepLast: boolean;
  priority: number;
  // The un-interrupted duration
  duration: number;
  keepDate?: Date;
  onDisappeared?(): void;
}

export type AlertsList = AlertProps[];

export interface AlertComponentBaseProps {
  streamId: string;
  channelId: string;
  channelName: string;
  alertType: string;
}
