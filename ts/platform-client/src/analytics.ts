import {
  AnalyticsEvent,
  SendAnalyticsResponse,
  SetIdentityResponse,
  AnalyticsService as AnalyticsServicePb,
} from '@noice-com/schemas/analytics/analytics.pb';
import { ClientType } from '@noice-com/schemas/api/client.pb';
import { Auth } from '@noice-com/schemas/auth/auth.pb';

import {
  AnalyticsClientCharacteristics,
  AnalyticsPayload,
  IAnalyticsService,
  IClient,
  IRequestParamsProvider,
  SubService,
} from './types';

const FLUSH_DELAY = 1000;
const NOICE_ANON_ID = 'noice_anon_id_key';
const IS_BROWSER = typeof window === 'object' && typeof document === 'object';

interface ExtendedClient extends IClient, IRequestParamsProvider {}

export class AnalyticsService extends SubService implements IAnalyticsService {
  private readonly _pageViewAnalyticsSessionStorageKey = 'pageViewAnalyticsSent';
  private _client: ExtendedClient;
  private _identity: string;
  private _seqId = 0;
  private _events: AnalyticsEvent[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _flushTimeout: any; // need to figure out a way to type timeouts in both node + web

  private _clientType: ClientType = ClientType.CLIENT_TYPE_UNSPECIFIED;

  private _clientCharacteristics: AnalyticsClientCharacteristics = {};

  private _flushes: Promise<SendAnalyticsResponse>[] = [];

  constructor(client: ExtendedClient) {
    super(client);
    this._client = client;
    this._client.onAuthenticated(this._onAuthenticated.bind(this));
    this._client.onClose((): void => {
      this._flush();
    });
    this._initIdentity();
  }

  private _initIdentity(): void {
    let id = this._client.storage.get(NOICE_ANON_ID) ?? '';

    if (!id) {
      id = generateRandomIdentity();
    }

    this._storeIdentity(id);
  }

  private _startFlushTimeout() {
    if (this._flushTimeout) {
      clearTimeout(this._flushTimeout);
    }

    this._flushTimeout = setTimeout(this._flush.bind(this), FLUSH_DELAY);
  }

  private async _flush(keepalive?: boolean): Promise<void> {
    this._flushTimeout = undefined;

    if (this._events.length === 0) {
      return;
    }

    const events = this._events.filter((event) => {
      if (!event.clientFirstPageLoad) {
        return true;
      }

      // Filter out page view analytics if they have already been sent
      if (IS_BROWSER && 'sessionStorage' in window) {
        const pageViewAnalyticsSent = sessionStorage.getItem(
          this._pageViewAnalyticsSessionStorageKey,
        );

        return !pageViewAnalyticsSent;
      }
    });

    this._events = [];

    events.forEach((event) => {
      event.batchOffsetMs = new Date().getTime() - new Date(event.clientTime).getTime();
    });

    if (events.length === 0) {
      return;
    }
    const p = this._sendAnalytics(events, keepalive);
    this._flushes.push(p);

    try {
      await p;

      if (events.some((event) => event.clientFirstPageLoad)) {
        if (IS_BROWSER && 'sessionStorage' in window) {
          sessionStorage.setItem(this._pageViewAnalyticsSessionStorageKey, 'true');
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to send events', e);
      this._events.push(...events);
    }

    this._flushes = this._flushes.filter((flush) => flush !== p);
  }

  private async _onAuthenticated(session: Auth): Promise<void> {
    if (!session.uid) {
      return;
    }

    const oldID = this._identity;
    const newID = session.uid || '';

    if (oldID !== newID) {
      this._storeIdentity(newID);
      await this._setIdentity(oldID, newID);
    }
  }

  private _storeIdentity(id: string): void {
    this._identity = id;
    this._client.storage.set(NOICE_ANON_ID, id);
  }

  private async _sendAnalytics(
    events: AnalyticsEvent[],
    keepalive?: boolean,
  ): Promise<SendAnalyticsResponse> {
    const options = await this._getInitReq();
    if (options && options.headers && typeof options.headers === 'object') {
      delete (options.headers as { [key: string]: string })['Authorization'];
    } else {
      options.headers = {};
    }

    return AnalyticsServicePb.SendAnalytics(
      {
        events: events,
      },
      {
        ...options,
        keepalive,
      },
    );
  }

  private async _setIdentity(
    identity: string,
    userIdentity: string,
  ): Promise<SetIdentityResponse> {
    return AnalyticsServicePb.SetIdentity(
      {
        identity: identity,
        userIdentity: userIdentity,
      },
      await this._getInitReq(),
    );
  }

  public trackEvent(payload: AnalyticsPayload): void {
    this.trackEventWithName('', payload);
  }

  public trackEventWithName(event: string, payload?: AnalyticsPayload): void {
    const seqId = ++this._seqId;

    const analyticsEvent: AnalyticsEvent = {
      identity: this._identity,
      sequenceId: seqId,
      clientTime: new Date().toISOString(),
      clientType: this._clientType,
      eventName: event,
      performanceNow: typeof performance === 'object' ? performance.now() : 0,
      ...this._clientCharacteristics,
    };

    if (payload) {
      Object.assign(analyticsEvent, payload);
    }

    this._events.push(analyticsEvent);

    this._startFlushTimeout();
  }

  public setClientType(type: ClientType): void {
    this._clientType = type;
  }

  public async sendEventsImmediately(
    options?: Parameters<IAnalyticsService['sendEventsImmediately']>[number],
  ): Promise<void> {
    // Wait any other pending flushes also
    await Promise.all([Promise.all(this._flushes), this._flush(options?.keepalive)]);
  }

  public setClientCharacteristics(characteristics: AnalyticsClientCharacteristics): void {
    this._clientCharacteristics = characteristics;
  }
}

function generateRandomIdentity(): string {
  if (IS_BROWSER && 'crypto' in window && 'randomUUID' in window.crypto) {
    return 'a-' + window.crypto.randomUUID();
  }

  return (
    'a-' +
    (Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15))
  );
}
