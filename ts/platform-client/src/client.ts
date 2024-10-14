/* eslint-disable @typescript-eslint/naming-convention */
import { Auth, Account, SessionTokenMode } from '@noice-com/schemas/auth/auth.pb';
import {
  SignUpRequest as SignUpRequestV4,
  SignInRequest as SignInRequestV4,
  CreateTemporaryAccountRequest,
  CompleteTemporaryAccountRequest,
} from '@noice-com/schemas/auth/authv4.pb';
import { InitReq } from '@noice-com/schemas/fetch.pb';

import { AnalyticsService } from './analytics';
import { AnnouncementService } from './announcement';
import { ArenaService } from './arena';
import { AuthService, AuthAdminService } from './auth';
import { AvatarService } from './avatar';
import { AvatarAnimationService } from './avataranimation';
import {
  ChannelService,
  ChannelConfigService,
  IngestConfigService,
  ChannelModerationService,
} from './channel';
import { ChatService } from './chat';
import { EmojiService } from './emoji';
import { isInvalidArgument, isUnauthenticated } from './error';
import { FeatureFlagService } from './featureflags';
import { FileUploadService } from './file-upload';
import { FriendsService } from './friends';
import { FTUEService } from './ftue';
import { GameEventsService } from './game-events';
import { GameCardService } from './gamecard';
import { GoalCardService } from './goalcard';
import { ItemService } from './item';
import { LeaderboardService } from './leaderboard';
import { logger, Logger, LogLevel, setGlobalLogLevel } from './lib/logging';
import { MatchMakingService, MatchService } from './match';
import { PlatformModerationService } from './moderation';
import { NotificationService } from './notification';
import { PartyService, PartyAdminService } from './party';
import { PlacementService } from './placements';
import { PrivacyService } from './privacy';
import { ProfileAdminService, ProfileService } from './profile';
import { ProgressionService } from './progression';
import { ReactionService } from './reaction';
import { RecordingService } from './recording';
import { RewardService } from './reward';
import { LocalStorage } from './storage';
import { StreamerService } from './streamer';
import { StreamingService } from './streaming';
import { SupportService } from './support';
import {
  IAnalyticsService,
  IClient,
  IRequestParamsProvider,
  IStorage,
  Session,
} from './types';
import { UserService } from './user';
import { UserInventoryService } from './userinventory';
import { WalletService } from './wallet';
import { WebSocketMuxer } from './websocketmuxer';

export type SessionManager = {
  refreshAccessToken(): Promise<Auth>;
};

export type ClientSettings = {
  useWSMuxer?: boolean;
  forceWSStreaming?: boolean;
  sessionManager?: SessionManager;
  storage?: IStorage;
  disableTokenRefresh?: boolean;
};

type BroadcastEvent =
  | {
      type: 'logout';
    }
  | {
      type: 'auth';
      session: Session;
    };

const REFRESH_GRACE_PERIOD = 1000 * 60 * 2; // 2 minutes
const REFRESH_RETRY_WINDOW = 5000;

const BROADCAST_CHANNEL_NAME = 'noice-session';

export class Client implements IClient, IRequestParamsProvider {
  public serverURL: string;
  public authURL: string;
  public session?: Session;
  public storage: IStorage;

  public AnnouncementService: AnnouncementService;
  public AuthService: AuthService;
  public AuthAdminService: AuthAdminService;
  public ArenaService: ArenaService;
  public AvatarService: AvatarService;
  public AvatarAnimationService: AvatarAnimationService;
  public EmojiService: EmojiService;
  public ProfileService: ProfileService;
  public UserInventoryService: UserInventoryService;
  public MatchMakingService: MatchMakingService;
  public MatchService: MatchService;
  public ChatService: ChatService;
  public NotificationService: NotificationService;
  public GoalCardService: GoalCardService;
  public RewardService: RewardService;
  public WalletService: WalletService;
  public ProgressionService: ProgressionService;
  public GameCardService: GameCardService;
  public ItemService: ItemService;
  public AnalyticsService: IAnalyticsService;
  public UserService: UserService;
  public StreamingService: StreamingService;
  public LeaderboardService: LeaderboardService;
  public StreamerService: StreamerService;
  public PlacementService: PlacementService;
  public FriendsService: FriendsService;
  public ChannelService: ChannelService;
  public ChannelModerationService: ChannelModerationService;
  public ChannelConfigService: ChannelConfigService;
  public IngestConfigService: IngestConfigService;
  public ProfileAdminService: ProfileAdminService;
  public PartyService: PartyService;
  public PartyAdminService: PartyAdminService;
  public PrivacyService: PrivacyService;
  public FTUEService: FTUEService;
  public FeatureFlagService: FeatureFlagService;
  public SupportService: SupportService;
  public FileUploadService: FileUploadService;
  public GameEventsService: GameEventsService;
  public PlatformModerationService: PlatformModerationService;
  public RecordingService: RecordingService;
  public ReactionService: ReactionService;

  private _authListeners: ((session: Auth) => void)[] = [];
  private _logoutListeners: ((session?: Auth) => void)[] = [];
  private _closeListeners: (() => void)[] = [];
  private _websocketMuxer: WebSocketMuxer;
  private _settings: ClientSettings;
  private _refreshPromise?: Promise<void>;
  private _logger: Logger;
  private _app: string;
  private _id: string;
  private _sessionManager?: SessionManager;
  private _restoreSessionLock?: Promise<void>;
  private _sessionInitialized = false;
  private _broadcastChannel?: BroadcastChannel;

  constructor(
    serverURL: string,
    settings: ClientSettings = {
      useWSMuxer: false,
    },
    authURL?: string,
    app?: string,
  ) {
    this.serverURL = serverURL;
    this.authURL = authURL || serverURL;

    this.storage = settings.storage || new LocalStorage();

    this._id = crypto.randomUUID();
    this._app = app || '';
    this._settings = settings;
    this._websocketMuxer = new WebSocketMuxer(this);

    if (settings.sessionManager) {
      this._sessionManager = settings.sessionManager;
    }

    this.AnnouncementService = new AnnouncementService(this);
    this.AuthService = new AuthService(this);
    this.AuthAdminService = new AuthAdminService(this);
    this.ArenaService = new ArenaService(this);
    this.AvatarService = new AvatarService(this);
    this.AvatarAnimationService = new AvatarAnimationService(this);
    this.EmojiService = new EmojiService(this);
    this.ProfileService = new ProfileService(this);
    this.UserInventoryService = new UserInventoryService(this);
    this.MatchMakingService = new MatchMakingService(this);
    this.MatchService = new MatchService(this);
    this.ChatService = new ChatService(this);
    this.NotificationService = new NotificationService(this);
    this.GoalCardService = new GoalCardService(this);
    this.WalletService = new WalletService(this);
    this.RewardService = new RewardService(this);
    this.ProgressionService = new ProgressionService(this);
    this.GameCardService = new GameCardService(this);
    this.ItemService = new ItemService(this);
    this.AnalyticsService = new AnalyticsService(this);
    this.UserService = new UserService(this);
    this.StreamingService = new StreamingService(this);
    this.LeaderboardService = new LeaderboardService(this);
    this.StreamerService = new StreamerService(this);
    this.PlacementService = new PlacementService(this);
    this.FriendsService = new FriendsService(this);
    this.ChannelService = new ChannelService(this);
    this.ChannelModerationService = new ChannelModerationService(this);
    this.ChannelConfigService = new ChannelConfigService(this);
    this.IngestConfigService = new IngestConfigService(this);
    this.PartyService = new PartyService(this);
    this.PartyAdminService = new PartyAdminService(this);
    this.ProfileAdminService = new ProfileAdminService(this);
    this.PrivacyService = new PrivacyService(this);
    this.FTUEService = new FTUEService(this);
    this.FeatureFlagService = new FeatureFlagService(this);
    this.SupportService = new SupportService(this);
    this.FileUploadService = new FileUploadService(this);
    this.GameEventsService = new GameEventsService(this);
    this.PlatformModerationService = new PlatformModerationService(this);
    this.RecordingService = new RecordingService(this);
    this.ReactionService = new ReactionService(this);

    if (typeof window === 'object' && `BroadcastChannel` in window) {
      this._broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      this._broadcastChannel.onmessage = this._handleBroadcastEvent.bind(this);
    }

    this._logger = logger('Client');
  }

  private _handleBroadcastEvent(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data) as BroadcastEvent;
      switch (data.type) {
        case 'logout':
          if (this.session) {
            this.clearSession(false);
          }
          break;
        case 'auth':
          this._setSession(data.session, false);
          break;
      }
    } catch (e) {
      this._logger.error('error parsing broadcast event', e);
    }
  }

  private _setSession(session: Session, broadcast = true) {
    if (typeof session.created === 'string') {
      session.created = new Date(session.created);
    }

    if (this.session && session.auth.token === this.session.auth.token) {
      return;
    }

    this._sessionInitialized = true;
    this.session = session;
    this._authListeners.forEach((listener) => listener(session.auth));

    if (broadcast) {
      this._broadcastEvent({ type: 'auth', session });
    }
  }

  private async _getAccessToken(): Promise<string> {
    if (!this._sessionInitialized) {
      return '';
    }

    let token = this?.auth?.token || '';

    if (token !== '') {
      token = await this._refreshAccessToken();
    }

    return token;
  }

  private async _refreshAccessToken(force?: boolean): Promise<string> {
    if (
      !this._settings.disableTokenRefresh &&
      (force || this.sessionTTL(this.session) < REFRESH_GRACE_PERIOD)
    ) {
      if (this._refreshPromise) {
        await this._refreshPromise;
      } else {
        await (this._refreshPromise = this._doRefreshToken()
          .then((auth) => {
            this._setSession({
              auth,
              created: new Date(),
            });
            return;
          })
          .finally(() => {
            this._refreshPromise = undefined;
          }));
      }
    }

    return this.auth?.token || '';
  }

  private async _doRefreshToken(): Promise<Auth> {
    if (this._sessionManager) {
      return this._sessionManager.refreshAccessToken();
    }

    const session = this.session;

    try {
      return await this.AuthService.refreshSession({
        refreshToken: this.session?.auth?.refreshToken,
        app: this._app,
        clientId: this._id,
      });
    } catch (err) {
      if (isUnauthenticated(err) || isInvalidArgument(err)) {
        this._logger.info('session expired, clearing session');
        this.clearSession();

        let errMessage = err.message;
        if (isInvalidArgument(err)) {
          errMessage = 'invalid argument';
        } else if (isUnauthenticated(err)) {
          errMessage = 'unauthenticated';
        }

        this.AnalyticsService.trackEvent({
          clientSessionRefreshFailure: {
            error: errMessage,
            tokenIssuedAt: session?.auth?.issuedAt,
            tokenExpiresAt: session?.auth?.expiresAt,
          },
        });

        throw err;
      } else if (this.sessionTTL(this.session) < REFRESH_RETRY_WINDOW) {
        throw err;
      } else {
        this._logger.error('error refreshing session, will retry later', err);
      }
    }
  }

  private sessionTTL(session?: Session): number {
    if (!session?.auth?.token) {
      return 0;
    }

    const expiresAt = new Date(session.auth.expiresAt ?? 0);
    const issuedAt = new Date(session.auth.issuedAt ?? 0);

    const lifetime = expiresAt.getTime() - issuedAt.getTime();
    const now = new Date().getTime();
    const localIssued = session.created.getTime();

    return lifetime - (now - localIssued);
  }

  private async _restoreSession(session: Session): Promise<void> {
    if (!this._settings.disableTokenRefresh) {
      this.session = session;

      try {
        await this._refreshAccessToken(true);
      } catch (e) {
        this.session = undefined;
        throw e;
      }
    }

    this._setSession(session);
    return;
  }

  private async _broadcastEvent(event: BroadcastEvent) {
    if (this._broadcastChannel) {
      this._broadcastChannel.postMessage(JSON.stringify(event));
    }
  }

  public async getInitReq(): Promise<InitReq> {
    if (this._restoreSessionLock) {
      await this._restoreSessionLock;
    }

    const req: InitReq = {
      pathPrefix: this.getPathPrefix(),
    };

    if (this._settings.useWSMuxer) {
      req.WebSocket = this._websocketMuxer.WebSocketFactory();
      req.forceWebSocket = this._settings.forceWSStreaming;
    }

    const token = await this._getAccessToken();

    // Note: sending an empty headers object will cause requests to fail on Android.
    if (token !== '') {
      req.headers = {
        Authorization: `Bearer ${this.auth.token}`,
      };
    }

    return req;
  }

  public getPathPrefix(): string {
    return this.serverURL;
  }

  public getInitAuthReq(): InitReq {
    return {
      pathPrefix: this.authURL,
      credentials: 'include',
    };
  }

  public onAuthenticated(delegate: (session: Auth) => void): () => void {
    if (this._sessionInitialized && this.auth) {
      delegate(this.auth);
    }

    this._authListeners.push(delegate);

    return () => {
      this._authListeners = this._authListeners.filter(
        (listener) => listener !== delegate,
      );
    };
  }

  public onLogout(delegate: (auth?: Auth) => void): () => void {
    this._logoutListeners.push(delegate);

    return () => {
      this._logoutListeners = this._logoutListeners.filter(
        (listener) => listener !== delegate,
      );
    };
  }

  public onClose(delegate: () => void): () => void {
    this._closeListeners.push(delegate);

    return () => {
      this._closeListeners = this._closeListeners.filter(
        (listener) => listener !== delegate,
      );
    };
  }

  public async passwordlessSignIn(req: SignInRequestV4): Promise<Account> {
    if (!req.sessionTokenMode) {
      req = {
        ...req,
        sessionTokenMode: SessionTokenMode.SESSION_TOKEN_MODE_PERSISTENT_COOKIE,
      };
    }

    const { auth, account } = await this.AuthService.passwordlessSignIn(req);
    this._setSession({
      auth,
      created: new Date(),
    });
    return account;
  }

  public async accessChannel(channelName: string) {
    await this.AuthService.accessChannel(channelName);
    await this._refreshAccessToken(true);
    this.NotificationService.resubscribe();
  }

  public async completeAccount(req: SignUpRequestV4): Promise<Account> {
    if (!req.sessionTokenMode) {
      req = {
        ...req,
        sessionTokenMode: SessionTokenMode.SESSION_TOKEN_MODE_PERSISTENT_COOKIE,
      };
    }

    const { auth, account } = await this.AuthService.completeAccount(req);
    this._setSession({
      auth,
      created: new Date(),
    });
    return account;
  }

  public async createTemporaryAccount(
    req: CreateTemporaryAccountRequest,
  ): Promise<Account> {
    if (!req.sessionTokenMode) {
      req = {
        ...req,
        sessionTokenMode: SessionTokenMode.SESSION_TOKEN_MODE_PERSISTENT_COOKIE,
      };
    }

    const { auth, account } = await this.AuthService.createTemporaryAccount(req);
    this._setSession({
      auth,
      created: new Date(),
    });
    return account;
  }

  public async completeTemporaryAccount(
    req: CompleteTemporaryAccountRequest,
  ): Promise<void> {
    if (!req.sessionTokenMode) {
      req = {
        ...req,
        sessionTokenMode: SessionTokenMode.SESSION_TOKEN_MODE_PERSISTENT_COOKIE,
      };
    }

    await this.AuthService.completeTemporaryAccount(req);
  }

  public async getToken(): Promise<string | undefined> {
    return (await this._getAccessToken()) || undefined;
  }

  public async refreshAccessToken(): Promise<void> {
    await this._refreshAccessToken(true);
  }

  public async clearSession(signout = true): Promise<void> {
    if (!this.session) {
      return;
    }

    const auth = this.session?.auth;
    this.session = undefined;

    const wasInitialized = this._sessionInitialized;
    this._sessionInitialized = false;

    if (!this._sessionManager && signout) {
      // only sign out if we're not using a session manager

      try {
        await this.AuthService.signOut(auth?.refreshToken);
      } catch (err) {
        this._logger.warn('sign out request failed', err);
      }
    }

    if (wasInitialized) {
      this._logoutListeners.forEach((listener) => listener(auth));
    }

    this._broadcastEvent({ type: 'logout' });
  }

  public async restoreSession(session: Session): Promise<void> {
    if (this._restoreSessionLock) {
      await this._restoreSessionLock;
    }

    this._restoreSessionLock = this._restoreSession(session);

    try {
      await this._restoreSessionLock;
    } catch (e) {
      this._restoreSessionLock = undefined;
      throw e;
    }
  }

  // poisonSession is a helper function for testing what happens when a session is expired
  public async poisonSession(): Promise<void> {
    await this.AuthService.signOut(this.auth?.refreshToken);
    const session = this.session;
    session.auth.expiresAt = new Date().toISOString();
    this._setSession(session);
  }

  public getSession(): Session {
    if (!this._sessionInitialized) {
      return;
    }

    return this.session;
  }

  public get auth(): Auth | undefined {
    if (!this._sessionInitialized) {
      return;
    }

    return this?.session?.auth;
  }

  public close() {
    this._closeListeners.forEach((listener) => listener());
  }

  public setLogLevel(logLevel: LogLevel) {
    setGlobalLogLevel(logLevel);
  }

  public async graphql(query: string, variables?: any): Promise<any> {
    const path = '/query';
    const init = await this.getInitReq();
    const { pathPrefix } = init || {};

    const url = pathPrefix ? `${pathPrefix}${path}` : path;

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...init.headers,
    };

    const res = await fetch(url, {
      ...init,
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const json = (await res.json()) as { data: any; errors: { message: string }[] };

    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message);
    }

    return json.data;
  }
}
