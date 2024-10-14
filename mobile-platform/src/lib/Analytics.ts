import { Client } from '@noice-com/platform-client';
import { ClientType } from '@noice-com/schemas/api/client.pb';
import { makeLoggers, Nullable } from '@noice-com/utils';

const { logInfo } = makeLoggers('Analytics');

// eslint-disable-next-line @typescript-eslint/naming-convention
class _Analytics {
  private client: Nullable<Client> = null;

  public init(client: Client) {
    this.client = client;
    this.client.AnalyticsService.setClientType(ClientType.CLIENT_TYPE_PLATFORM_MOBILE);
  }

  public trackEvent(...params: Parameters<Client['AnalyticsService']['trackEvent']>) {
    if (!this.client) {
      logInfo('Has not initialized analytics.');
      return;
    }
    this.client.AnalyticsService.trackEvent(...params);
  }
}

export const Analytics = new _Analytics();
