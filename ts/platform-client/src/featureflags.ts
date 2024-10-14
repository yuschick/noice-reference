import { NotifyStreamEntityArrival } from '@noice-com/schemas/fetch.pb';
import {
  FeatureFlagState,
  FeatureFlagService as FeatureFlagsServicePb,
  FeatureFlagConfig,
  FeatureFlagSchema,
} from '@noice-com/schemas/flag/flag.pb';

import {
  IClient,
  IFeatureFlagService,
  IRequestParamsProvider,
  FeatureFlagUpdateListener,
  IFeatureFlags,
  SubService,
} from './types';

interface ExtClient extends IClient, IRequestParamsProvider {}

class FeatureFlags implements IFeatureFlags {
  private _values: { [key: string]: string } = {};
  constructor(states: FeatureFlagState[]) {
    states.forEach((state) => {
      if (state.name && state.value) {
        this._values[state.name] = state.value;
      }
    });
  }

  public get(name: string, defaultValue = ''): string {
    return this._values[name] || defaultValue;
  }

  public has(name: string): boolean {
    return this._values.hasOwnProperty(name);
  }

  public values(): { [key: string]: string } {
    return { ...this._values };
  }
}

export class FeatureFlagService extends SubService implements IFeatureFlagService {
  private _featureFlags?: Promise<FeatureFlags>;
  private _listeners: FeatureFlagUpdateListener[] = [];
  private _client: ExtClient;
  private _abortController?: AbortController;
  private _uid = '';

  constructor(cli: ExtClient) {
    super(cli);

    this._client = cli;

    cli.onAuthenticated((auth) => {
      const uid = auth.uid || '';
      if (this._uid !== '' && this._uid !== uid) {
        this._loadFeatureFlags();
      }
    });
  }

  private _loadFeatureFlags(): Promise<FeatureFlags> {
    return (this._featureFlags = new Promise((resolve, reject) => {
      (async () => {
        if (this._abortController) {
          this._abortController.abort();
        }

        this._abortController = new AbortController();

        const userID = this._client.getSession()?.auth?.uid;

        if (!userID) {
          throw new Error('user is not logged in');
        }

        this._uid = userID || '';

        const res = await FeatureFlagsServicePb.ListUserFeatureFlags(
          { userId: userID },
          { ...(await this._getInitReq()), signal: this._abortController.signal },
        );

        if (res.flags) {
          const flags = new FeatureFlags(res.flags || []);
          resolve(flags);
          this._listeners.forEach((listener) => listener(flags));
        }
      })().catch(reject);
    }));
  }

  public async reload(): Promise<void> {
    await this._loadFeatureFlags();
  }

  public isAvailable(): boolean {
    return !!this._featureFlags;
  }

  public async getFeatureFlags(): Promise<IFeatureFlags> {
    if (!this._featureFlags) {
      this._loadFeatureFlags();
    }

    return this._featureFlags;
  }

  public onFeatureFlagsUpdate(callback: FeatureFlagUpdateListener): () => void {
    this._listeners.push(callback);

    return () => {
      const idx = this._listeners.indexOf(callback);

      if (idx > -1) {
        this._listeners.splice(idx, 1);
      }
    };
  }

  public async getFeatureFlagConfig(): Promise<FeatureFlagConfig> {
    return FeatureFlagsServicePb.GetFeatureFlagConfig({}, await this._getInitReq());
  }

  public streamConfigUpdates(
    onUpdate: NotifyStreamEntityArrival<FeatureFlagConfig>,
    onError: (err: Error) => void,
  ): () => void {
    const abort = new AbortController();

    this._getInitReq()
      .then((init) => {
        const promise = FeatureFlagsServicePb.StreamConfigUpdates({}, onUpdate, {
          ...init,
          signal: abort.signal,
        });

        return promise;
      })
      .catch(onError);

    return () => {
      abort.abort();
    };
  }
  public async setFeatureFlagConfig(
    previousRevision: string,
    config: FeatureFlagConfig,
    validateSchema = false,
  ): Promise<FeatureFlagConfig> {
    const res = await FeatureFlagsServicePb.SetFeatureFlagConfig(
      { config, previousRevision, validateSchema },
      await this._getInitReq(),
    );

    return res;
  }

  public async getFeatureFlagSchema(): Promise<FeatureFlagSchema> {
    return await FeatureFlagsServicePb.GetFeatureFlagSchema({}, await this._getInitReq());
  }
}
