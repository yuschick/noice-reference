import { CoreAssets } from '@noice-com/assets-core';
import {
  NotificationsProvider,
  CardGame,
  withHideableFallback,
} from '@noice-com/card-game';
import { ChatProvider, useChatAPI } from '@noice-com/chat-react-web';
import { useConditionalOnce } from '@noice-com/common-react-core';
import {
  CommonUtils,
  ErrorBoundary,
  IconButton,
  useAnalytics,
  useAuthentication,
  useKeyContentLoadMetadata,
  useKeyContentLoadTracker,
  useLeavingTransition,
  useMediaQuery,
  useToggle,
} from '@noice-com/common-ui';
import { StreamPlacement } from '@noice-com/schemas/stream/egress.pb';
import { StreamSettingsProvider } from '@noice-com/stream';
import classNames from 'classnames';
import { useEffect } from 'react';
import { matchPath, useLocation } from 'react-router';
import { useMedia } from 'use-media';

import { ConnectionStatusBar } from '../ConnectionStatusBar';
import { useContentModeStates } from '../hooks';
import { useTooManyViewersErrorHandler } from '../hooks/useTooManyViewersErrorHandler.hook';

import { AvatarEmotes } from './AvatarEmotes';
import { ChatSm } from './ChatSm';
import { GameSidebar } from './GameSidebar';
import styles from './GameView.module.css';
import { GameViewStateProvider } from './GameViewStateProvider';
import { GuideToMetaGame } from './GuideToMetaGame';
import {
  useChatBoosterRequest,
  useGameChannelPageToggle,
  useGroupChangeListeners,
  useGroupEvents,
  useGuideToMetaGame,
  useHandleResize,
  useInactivityKick,
  useInitDebugView,
  useMatchGroupChatId,
  useIsCardSelectOpen,
  useStreamChannelBan,
  useStreamChannel,
  useTeamMergeListener,
  useTheaterMode,
  useSmallScreenChat,
  useMatchEndMicroSurvey,
  useSoftwareRenderingNotification,
  useMatchAnalytics,
} from './hooks';
import { useMatchCardAvailable } from './hooks/useMatchCardAvailable.hook';
import { ImplicitAccountGameBanner } from './ImplicitAccountGameBanner';
import { MobileStream } from './MobileStream';
import { PipOverlay } from './PipOverlay';
import { SeasonBreakBottomBar } from './SeasonBreakBottomBar';
import { Stream } from './Stream';
import { StreamRankUpDialog } from './StreamRankUpDialog/StreamRankUpDialog';
import { StreamSettings } from './StreamSettings';

import { LiveBadge } from '@common/channel';
import { fullScreenPages } from '@common/route';
import { StreamViewState, useStreamGame, useStreamState } from '@common/stream';
import { UnreadFlagsProvider, useFeatureFlag } from '@context';

export function GameView() {
  const location = useLocation();
  const [hideCR] = useFeatureFlag('hideCR');
  const [hideGameUI] = useFeatureFlag('hideGame');
  const { trackEvent } = useAnalytics();
  const { isFullAccount } = useAuthentication();

  // Global states
  const isCardSelectOpen = useIsCardSelectOpen();
  const { streamViewState, streamWrapperRef } = useStreamState();
  const { streamId, matchGroupId, isSolo } = useStreamGame();

  useKeyContentLoadTracker('match_group', !matchGroupId);

  const setKeyContentMetadata = useKeyContentLoadMetadata();

  // Data
  const screenIsWide = useMedia({ minWidth: 1460 });
  const { groupEvents } = useGroupEvents();
  const { channel, loading } = useStreamChannel(streamId);
  const channelId = channel?.id;
  const isNoicePredictionsEnabled = channel?.game?.noicePredictionsEnabled ?? false;
  const matchGroupChatId = useMatchGroupChatId(streamId, matchGroupId);
  const { onChannelPageButtonClick, onReturnToStreamClick, wrapperStyles } =
    useGameChannelPageToggle({
      streamWrapperRef,
      channelName: channel?.name ?? null,
    });
  const { wrapperRef, onTransitionEnd } = useHandleResize();

  const { showGuideToMetaGame, onCloseGuideToMetaGame } = useGuideToMetaGame();

  const {
    isTheaterMode,
    isSoftwareRendering,
    toggleTheaterMode,
    loading: loadingTheaterMode,
  } = useTheaterMode();

  // Hide game view on fullscreen pages
  const hideGameView = fullScreenPages.some(
    (page) => !!matchPath(page, location.pathname),
  );

  // Listeners
  useStreamChannelBan(channelId ?? null);
  useInactivityKick();
  useMatchCardAvailable();
  useGroupChangeListeners();
  useChatBoosterRequest();
  useInitDebugView();
  useTeamMergeListener();
  useMatchEndMicroSurvey({ gameName: channel?.game.name });
  useSoftwareRenderingNotification();

  // Analytics
  useMatchAnalytics();

  const { onTooManyViewersErrorCallback } = useTooManyViewersErrorHandler();

  const { isSpotlightShowing, isMatchEndShowing } = useContentModeStates();

  // Clear booster messages when joining to stream
  const { clearAllBoosterRequests } = useChatAPI();

  useEffect(() => {
    if (streamId) {
      clearAllBoosterRequests();
    }
  }, [clearAllBoosterRequests, streamId]);

  const [isGameSidebarExpanded, toggleGameSidebarExpanded] = useToggle(true);

  const isMinimizedStream =
    streamViewState === StreamViewState.PiP ||
    streamViewState === StreamViewState.ChannelPage;

  const { isLeaving: isLeavingMinimizedTransition } = useLeavingTransition({
    isShown: isMinimizedStream,
    duration: '--noi-duration-quick',
  });

  const hideContentOnMinimized = isMinimizedStream || isLeavingMinimizedTransition;

  // These two are different things.
  // Should mount game UI is whether the game UI should be mounted at all.
  // Should hide game UI is whether the game UI should be hidden, and is mostly
  // used within the game UI itself to hide the game UI when it's not supposed
  // to be visible. (We sometimes need to hide the game UI when it's mounted)
  const shouldMountGameUI = !hideContentOnMinimized && !hideGameUI;
  const shouldHideGameUI = !shouldMountGameUI;

  const isSidebarDisabled = isCardSelectOpen && !screenIsWide;

  const isPiPMode = streamViewState === StreamViewState.PiP;
  const isChannelPageMode = streamViewState === StreamViewState.ChannelPage;

  const activeSeason = channel?.game?.activeSeason;
  const seasonBreak = !!activeSeason?.seasonBreak;
  const gameEnabled = !seasonBreak && !!matchGroupId;

  const isLandscape = useMediaQuery('(orientation: landscape)');
  const isSmallScreen = useMediaQuery(
    `((orientation: portrait) and (max-width: ${CommonUtils.getRem(
      459,
    )})) or ((orientation: landscape) and (max-height: ${CommonUtils.getRem(459)}))`,
  );
  const isSmallScreenLandscape = isLandscape && isSmallScreen;
  const isSmallScreenPortrait = !isLandscape && isSmallScreen;

  const hideGameSidebar = isSmallScreen || isSidebarDisabled;
  const hideSettings = isSmallScreen || isCardSelectOpen;
  const hideCardGameContent =
    shouldHideGameUI ||
    showGuideToMetaGame ||
    (!isTheaterMode && isSpotlightShowing) ||
    isSmallScreenLandscape;
  const hideSpotlights = isSmallScreenLandscape;
  const isRawStream = !matchGroupId || isSmallScreen || isTheaterMode;

  const {
    isSmallScreenChatMounted,
    isSmallScreenChatOpen,
    onClose: onCloseChat,
    onOpen: onOpenChat,
  } = useSmallScreenChat({ forceHide: !isSmallScreen || hideCardGameContent });

  useEffect(() => {
    if (isMinimizedStream) {
      delete document.body.dataset.gameSidebar;
      return;
    }

    document.body.dataset.gameSidebar = hideGameSidebar
      ? 'hidden'
      : isGameSidebarExpanded
      ? 'expanded'
      : 'collapsed';

    return () => {
      delete document.body.dataset.gameSidebar;
    };
  }, [isGameSidebarExpanded, hideGameSidebar, isMinimizedStream]);

  const chatIcon = (
    <IconButton
      icon={CoreAssets.Icons.Chat}
      label="Chat"
      level="secondary"
      onClick={onOpenChat}
    />
  );

  // Just in case, if the stream view state is none, there should not be game view
  // (some times leave game fails and we end up in this state)
  const notReadyToRender =
    streamViewState === StreamViewState.None || loading || loadingTheaterMode;

  useKeyContentLoadTracker('game_view_ready_to_render', notReadyToRender);

  useConditionalOnce(() => {
    setKeyContentMetadata('is_theater_mode', isTheaterMode.toString());

    trackEvent({
      clientGameViewRendered: {
        channelId,
        streamId: streamId ?? undefined,
        matchGroupId: matchGroupId ?? '',
        isNoicePredictionsEnabled,
        // theater mode term is used widely to mean non-arena mode, but it's not matching
        // the code always. So that's why the analytic field is named as isTheaterMode, but really
        // it's about the raw stream.
        isTheaterMode: isRawStream,
        isArenaModeCapable: !isSoftwareRendering && !isSmallScreen,
        isSmallScreen,
        isSoftwareRendering,
      },
    });
  }, !notReadyToRender && !!channelId && !!streamId);

  if (notReadyToRender) {
    return null;
  }

  return (
    <GameViewStateProvider>
      <UnreadFlagsProvider>
        <NotificationsProvider>
          <ChatProvider
            channelId={channelId ?? null}
            groupChatId={isSolo ? undefined : matchGroupChatId}
            streamChatId={channel?.currentChatId ?? null}
          >
            <div
              className={classNames(styles.gameViewRoot, {
                [styles.gameMode]: streamViewState === StreamViewState.Full,
                [styles.pipMode]: isPiPMode,
                [styles.isLeavingTransition]: isLeavingMinimizedTransition,
                [styles.channelPageMode]: isChannelPageMode,
                [styles.theaterMode]: isTheaterMode,
                [styles.hideGameSidebar]: hideGameSidebar,
                [styles.gameSidebarExpanded]: isGameSidebarExpanded,
                [styles.hiddenGameView]: hideGameView,
                [styles.noicePredictionsDisabled]: !matchGroupId,
              })}
              data-ftue-anchor={
                streamViewState === StreamViewState.PiP ? 'PiP' : undefined
              }
              ref={wrapperRef}
              style={wrapperStyles}
              onTransitionEnd={onTransitionEnd}
            >
              {/* STREAM + OVERLAY + CARD GAME */}

              <div className={styles.gameViewContent}>
                <StreamSettingsProvider>
                  {!hideCR && !!streamId && (
                    <>
                      {isSmallScreen ? (
                        <MobileStream
                          channelId={channel?.id}
                          groupId={matchGroupId}
                          hideSpotlights={hideSpotlights}
                          isChatOpen={isSmallScreenChatOpen}
                          isGuideToMetaGameShowing={showGuideToMetaGame}
                          isMatchEndShowing={isMatchEndShowing}
                          isMinimizedStream={isMinimizedStream}
                          streamId={streamId}
                          onChannelPageButtonClick={onChannelPageButtonClick}
                          onTooManyViewersErrorCallback={onTooManyViewersErrorCallback}
                        />
                      ) : (
                        <Stream
                          groupId={matchGroupId}
                          isMinimizedStream={isMinimizedStream}
                          isTheaterMode={isTheaterMode}
                          placement={StreamPlacement.STREAM_PLACEMENT_GAME_VIEW}
                          streamId={streamId}
                          onTooManyViewersErrorCallback={onTooManyViewersErrorCallback}
                        />
                      )}
                    </>
                  )}
                  {gameEnabled && (
                    <ErrorBoundary fallback={withHideableFallback(shouldHideGameUI)}>
                      <CardGame
                        hideContent={hideCardGameContent}
                        highScoringCardsClassName={styles.highScoringCard}
                        showMatchEnd={isMatchEndShowing}
                        slots={{
                          cardContainerSmAction: chatIcon,
                        }}
                      />
                    </ErrorBoundary>
                  )}

                  {/* For just chatting -type of stream we render chat icon for small screens */}
                  {isSmallScreenPortrait && !matchGroupId && !isMinimizedStream && (
                    <div className={styles.justChattingSmWrapper}>{chatIcon}</div>
                  )}
                  {activeSeason && !isMinimizedStream && (
                    <SeasonBreakBottomBar season={activeSeason} />
                  )}

                  {isSmallScreenChatMounted && channel && (
                    <ChatSm
                      channelId={channel.id}
                      className={classNames(styles.gameViewSmChatWrapper, {
                        [styles.appear]: isSmallScreenChatOpen,
                      })}
                      onClose={onCloseChat}
                    />
                  )}

                  {shouldMountGameUI && (
                    <>
                      {!hideSettings && (
                        <StreamSettings
                          isNoicePredictionsEnabled={!!matchGroupId}
                          isTheaterMode={isTheaterMode}
                          toggleTheaterMode={toggleTheaterMode}
                        />
                      )}

                      {showGuideToMetaGame &&
                        (isFullAccount ? (
                          <GuideToMetaGame onSkip={onCloseGuideToMetaGame} />
                        ) : (
                          <ImplicitAccountGameBanner
                            gameId={channel?.game.id ?? null}
                            onSkip={onCloseGuideToMetaGame}
                          />
                        ))}
                    </>
                  )}
                  {!hideContentOnMinimized && <ConnectionStatusBar />}
                </StreamSettingsProvider>
              </div>

              {/* SIDEBAR */}

              {!hideContentOnMinimized && !hideGameSidebar && (
                <aside className={styles.gameSidebarWrapper}>
                  <GameSidebar
                    channelId={channel?.id ?? null}
                    className={styles.gameSidebar}
                    groupEvents={groupEvents}
                    isGameSidebarExpanded={isGameSidebarExpanded}
                    isNoicePredictionsEnabled={!!matchGroupId}
                    toggleGameSidebarExpanded={toggleGameSidebarExpanded}
                    onChannelPageButtonClick={onChannelPageButtonClick}
                  />

                  {!isTheaterMode && !!matchGroupId && (
                    <AvatarEmotes className={styles.sidebarAvatarEmotes} />
                  )}
                </aside>
              )}

              {/* MISC */}

              {isMinimizedStream && (
                <PipOverlay
                  channel={channel}
                  isChannelPage={streamViewState === StreamViewState.ChannelPage}
                  onExpandClicked={onReturnToStreamClick}
                />
              )}

              {streamViewState === StreamViewState.ChannelPage && (
                <span className={styles.liveBadge}>
                  <LiveBadge />
                </span>
              )}

              {!!channel?.game.id && (
                <StreamRankUpDialog
                  gameId={channel.game.id}
                  seasonId={channel.game.activeSeason.id}
                />
              )}
            </div>
          </ChatProvider>
        </NotificationsProvider>
      </UnreadFlagsProvider>
    </GameViewStateProvider>
  );
}
