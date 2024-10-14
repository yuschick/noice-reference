import { Nullable } from '@noice-com/utils';
import { FC, MouseEvent } from 'react';
import { MosaicNode } from 'react-mosaic-component';

// Has to be imported from types file to avoid circular dependency
import { StreamStatus } from '@common/stream/types';

export type WidgetMenuOption = {
  text: string;
  icon?: SvgrComponent;
  onClick: (event: MouseEvent) => void;
};

export type WidgetResizeCallback = () => void;

export enum ActionType {
  StreamInfo = 'streamInfo',
  CameraDriveTransition = 'triggerCameraDriveTransition',
}

export type ActionsWidgetOptions = {
  enabledActions: ActionType[];
};

export type ChatWidgetOptions = {
  showUserList?: boolean;
};

export type GameAndCrowdWidgetOptions = {
  showCrowd?: boolean;
};

export type AnyWidgetOptions =
  | ActionsWidgetOptions
  | ChatWidgetOptions
  | GameAndCrowdWidgetOptions;

export type WidgetOptions = { [widgetId: string]: AnyWidgetOptions };

export interface WidgetLayoutState<T extends string = WidgetId> {
  widgets: MosaicNode<T> | null;
  options?: WidgetOptions;
}

export enum WidgetId {
  Actions = 'Actions',
  ActivityFeed = 'Activity Feed',
  AudienceInsights = 'Audience Insights',
  AutoMod = 'AutoMod queue',
  Challenges = 'Challenges',
  Chat = 'Chat',
  ChatUserList = 'User List',
  GameCrowd = 'Game & Crowd',
  Leaderboard = 'Leaderboard',
  ModeratorLog = 'Moderator Log',
  StreamHighlights = 'Stream Highlights',
  TopPredictions = 'Top Predictions',
}

export interface WidgetOfflineProps {
  description?: string;
  loading?: boolean;
  icon?: SvgrComponent;
  title: string;
}

export interface WidgetOfflineCheck {
  layout: Nullable<WidgetLayoutState>;
  liveStatus: Nullable<StreamStatus>;
  streamId: Nullable<string>;
  isNoicePredictionsEnabled: boolean;
}

interface WidgetProps<T = Nullable<string>> {
  setResizeCallback: (callback?: WidgetResizeCallback) => void;
  widgetId: WidgetId;
  streamId: T;
}

export type LiveChannelWidgetProps = WidgetProps<string>;
export type ChannelWidgetProps = WidgetProps;

interface BaseWidgetConfig<C> {
  id: WidgetId;
  Component: C;
  options?: AnyWidgetOptions;
}

export interface LiveChannelWidgetConfig
  extends BaseWidgetConfig<FC<LiveChannelWidgetProps>> {
  offline: (check: WidgetOfflineCheck) => WidgetOfflineProps | null;
}

export type ChannelWidgetConfig = BaseWidgetConfig<FC<ChannelWidgetProps>>;

export type WidgetConfig = ChannelWidgetConfig | LiveChannelWidgetConfig;
