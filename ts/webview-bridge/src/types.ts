/* @todo, should be able to import conversion events from common-ui.
However I ran into an issue where lint fails in CI/CD but not locally.
Need to revisit this when someone with more experience on monorepo packages can take a look.

import { AnyConversionEvent } from '@noice-com/common-ui';
*/
import { Session } from '@noice-com/platform-client';
import { Auth } from '@noice-com/schemas/auth/auth.pb';
import { QualityLayer } from '@noice-com/schemas/stream/egress.pb';

/**
 * Should be replaced with AnyConversionEvent from common-ui
 */
type TempConversionEvent = {
  event:
    | 'ChannelFollowed'
    | 'AdViewed'
    | 'SignupCompleted'
    | 'ChannelPageView'
    | 'GameFinishedMatch'
    | 'ItemPurchased'
    | 'CardPackPurchased'
    | 'GameCardPicked'
    | 'GameCardScored'
    | 'Login';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & Record<string, any>;

export type SessionManager = {
  refreshAccessToken(): Promise<Auth>;
  getSession(): Promise<Session>;
};

export type LoadingEvents = {
  onEmbedReady(): Promise<void>;
  onNavigate(url: string): Promise<void>;
  onPageLoaded(): Promise<void>;
};

export type StreamEvents = {
  onConversionEvent(eventName: TempConversionEvent): Promise<void>;
  onVideoStreamQualityChange(
    currentQuality: QualityLayer | null,
    available: QualityLayer[],
  ): Promise<void>;
};

export type EventHandlers = LoadingEvents & StreamEvents;

export type MobileDeviceMetadata = {
  osName: string;
  buildNumber: string;
  version: string;
  deviceModel: string;
};

export type NativeBridge = SessionManager & EventHandlers;

export type WebBridge = {
  setStreamQuality(quality: QualityLayer): Promise<void>;
};

/**
 * List of routes that should be handled on the native side.
 */
export const blockedWebRoutesList = [/^\/store\/[^/]+\/[^/]+$/, /^\/browse$/, /^\/$/];
