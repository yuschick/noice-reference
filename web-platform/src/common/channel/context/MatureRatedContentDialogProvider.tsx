import { gql } from '@apollo/client';
import {
  useAnalytics,
  useAuthentication,
  useConfirmDialog,
  useDialog,
  useKeyContentLoadMetadata,
  WithChildren,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useCallback, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { getJoinGameText } from '../utils';

import {
  FULL_USER_MATURE_RATED_CONTENT_DIALOG_SECTION,
  GUEST_USER_MATURE_RATED_CONTENT_DIALOG_SECTION,
  MATURE_RATED_CONTENT_DIALOG_ACTION_BROWSE_OTHER_GAMES,
  MATURE_RATED_CONTENT_DIALOG_ACTION_JOIN_GAME,
  MATURE_RATED_CONTENT_DIALOG_ACTION_OPEN,
} from '@common/channel/analytics';
import { Routes } from '@common/route';
import { useStreamGame } from '@common/stream';
import {
  MatureRatedContentDialogChannelFragment,
  useMatureRatedContentDialogProviderChannelLazyQuery,
  useMatureRatedContentDialogProviderProfileLazyQuery,
} from '@gen';

gql`
  query MatureRatedContentDialogProviderProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      account {
        uid
        matureRatedContentAllowed
      }
      settings {
        privacy {
          showMatureContentWarning
        }
      }
    }
  }

  query MatureRatedContentDialogProviderChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      ...IsGamePredictionsEnabledChannel
    }
  }

  fragment MatureRatedContentDialogChannel on ChannelChannel {
    id
    matureRatedContent
  }
`;

type MatureRatedContentDialog = 'warning' | 'notAllowed' | 'implicit';

interface ShowMatureRatedContentDialogOptions {
  dialog: MatureRatedContentDialog;
  channelId: string;
  onJoinGame: () => Promise<void>;
}

interface GetDialogShowArguments {
  channel: MatureRatedContentDialogChannelFragment;
  usedInChannelPage: boolean;
}

interface Context {
  matureRatedContentNotAllowedDialogStore: ReturnType<typeof useConfirmDialog>;
  matureRatedContentWarningDialogStore: ReturnType<typeof useDialog>;
  matureRatedContentImplicitAccountDialogStore: ReturnType<typeof useConfirmDialog>;
  joinGameText: string;
  onCloseMatureRatedContentWarningDialog(): void;
  onJoinGame(): Promise<void>;
  onShowMatureRatedContentNotAllowedDialog(): void;
  getWhatDialogShouldBeShown(
    args: GetDialogShowArguments,
  ): Promise<MatureRatedContentDialog | false>;
  onShowMatureRatedContentDialog(
    args: ShowMatureRatedContentDialogOptions,
  ): Promise<void>;
}

const MatureRatedContentDialogContext = createContext<Nullable<Context>>(null);

export function MatureRatedContentDialogProvider({ children }: WithChildren) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, isImplicitAccount } = useAuthentication();
  const { channelId: currentChannelId } = useStreamGame();
  const { trackButtonClickEvent } = useAnalytics();
  const setKeyContentMetadata = useKeyContentLoadMetadata();

  const [joinGameText, setJoinGameText] = useState('');
  const [onJoinGame, setOnJoinGame] = useState<() => Promise<void>>(() =>
    Promise.resolve(),
  );

  const [fetchProfile] = useMatureRatedContentDialogProviderProfileLazyQuery();
  const [fetchChannel] = useMatureRatedContentDialogProviderChannelLazyQuery();

  const onCancelNavigate = useCallback(() => {
    // If we are in browse pages / following page, we don't want to navigate to anywhere
    if (
      location.pathname === Routes.Browse ||
      location.pathname === Routes.Following ||
      location.pathname.startsWith(`${Routes.Browse}/`)
    ) {
      return;
    }

    // If we are in home, we don't want to navigate to anywhere
    if (location.pathname === Routes.Home) {
      return;
    }

    navigate(Routes.Home);
  }, [location.pathname, navigate]);

  const matureRatedContentWarningDialogStore = useDialog({
    title: 'This channel is intended for mature audiences',
    onOpen() {
      trackButtonClickEvent(MATURE_RATED_CONTENT_DIALOG_ACTION_OPEN, {
        section: FULL_USER_MATURE_RATED_CONTENT_DIALOG_SECTION,
      });
    },
    onClose() {
      setJoinGameText('');
      setOnJoinGame(() => Promise.resolve);
    },
    options: {
      closeOnOutsideClick: false,
    },
  });

  const matureRatedContentImplicitAccountDialogStore = useConfirmDialog({
    title: 'This channel is intended for mature audiences',
    description: 'The content may not be appropriate for some users.',
    onOpen() {
      trackButtonClickEvent(MATURE_RATED_CONTENT_DIALOG_ACTION_OPEN, {
        section: GUEST_USER_MATURE_RATED_CONTENT_DIALOG_SECTION,
      });
    },
    onCancel: [
      () => {
        trackButtonClickEvent(MATURE_RATED_CONTENT_DIALOG_ACTION_BROWSE_OTHER_GAMES, {
          section: GUEST_USER_MATURE_RATED_CONTENT_DIALOG_SECTION,
        });
        onCancelNavigate();
      },
      { label: 'Browse other channels' },
    ],
    onConfirm: [
      () => {
        trackButtonClickEvent(MATURE_RATED_CONTENT_DIALOG_ACTION_JOIN_GAME, {
          section: GUEST_USER_MATURE_RATED_CONTENT_DIALOG_SECTION,
        });
        onJoinGame();
      },
      { label: joinGameText },
    ],
    onClose() {
      setJoinGameText('');
      setOnJoinGame(() => Promise.resolve);
    },
    options: {
      closeOnOutsideClick: false,
    },
  });

  const matureRatedContentNotAllowedDialogStore = useConfirmDialog({
    title: 'This channel is intended for mature audiences',
    onConfirm: [onCancelNavigate, { label: 'Browse other channels' }],
    onClose() {
      // Remove the state so that the dialog does not show again automatically
      location.state = { ...location.state, showMatureRatedContentNotAllowed: false };
    },
  });

  const getWhatDialogShouldBeShown = useCallback(
    async ({
      channel,
      usedInChannelPage,
    }: GetDialogShowArguments): Promise<MatureRatedContentDialog | false> => {
      if (channel.id === currentChannelId) {
        // don't show dialog when user opens channel which stream is in PiP mode
        return false;
      }

      // Don't show the dialog if there is already a PiP for other stream,
      // if user is not on channel page
      if (currentChannelId && channel.id !== currentChannelId && !usedInChannelPage) {
        return false;
      }

      if (!channel.matureRatedContent) {
        return false;
      }

      if (!userId) {
        return 'notAllowed';
      }

      if (isImplicitAccount) {
        if (!location.state?.ignoreMatureRatedWarningDialog) {
          return 'implicit';
        }

        return false;
      }

      const { data } = await fetchProfile({ variables: { userId } });
      const profile = data?.profile;

      if (!isImplicitAccount && !profile?.account?.matureRatedContentAllowed) {
        return 'notAllowed';
      }

      // If the location state has showMatureRatedContentNotAllowed, we should not show the dialog
      if (location.state?.ignoreMatureRatedWarningDialog) {
        return false;
      }

      if (profile?.settings?.privacy.showMatureContentWarning) {
        return 'warning';
      }

      return false;
    },
    [
      currentChannelId,
      fetchProfile,
      isImplicitAccount,
      location.state?.ignoreMatureRatedWarningDialog,
      userId,
    ],
  );

  const onShowMatureRatedContentDialog = useCallback(
    async ({
      dialog,
      channelId,
      onJoinGame: onJoinGameCallback,
    }: ShowMatureRatedContentDialogOptions) => {
      const { data } = await fetchChannel({ variables: { channelId } });
      const channel = data?.channel;

      if (!channel) {
        return;
      }

      setKeyContentMetadata('mature_content_warning', 'shown');

      if (dialog === 'warning') {
        setJoinGameText(getJoinGameText(channel));
        setOnJoinGame(() => {
          return async () => {
            await onJoinGameCallback();
            matureRatedContentWarningDialogStore.actions.close();
            location.state = { ...location.state, ignoreMatureRatedWarningDialog: false };
          };
        });
        matureRatedContentWarningDialogStore.actions.open();
        return;
      }

      if (dialog === 'notAllowed') {
        matureRatedContentNotAllowedDialogStore.actions.open();
        return;
      }

      if (dialog === 'implicit') {
        setJoinGameText(getJoinGameText(channel));
        setOnJoinGame(() => {
          return async () => {
            await onJoinGameCallback();
            matureRatedContentImplicitAccountDialogStore.actions.close();
            location.state = { ...location.state, ignoreMatureRatedWarningDialog: false };
          };
        });
        matureRatedContentImplicitAccountDialogStore.actions.open();
        return;
      }
    },
    [
      fetchChannel,
      setKeyContentMetadata,
      matureRatedContentWarningDialogStore.actions,
      location,
      matureRatedContentNotAllowedDialogStore.actions,
      matureRatedContentImplicitAccountDialogStore.actions,
    ],
  );

  const onShowMatureRatedContentNotAllowedDialog = () => {
    matureRatedContentNotAllowedDialogStore.actions.open();
  };

  const onCloseMatureRatedContentWarningDialog = () => {
    matureRatedContentWarningDialogStore.actions.close();
    onCancelNavigate();
  };

  return (
    <MatureRatedContentDialogContext.Provider
      value={{
        matureRatedContentWarningDialogStore,
        matureRatedContentImplicitAccountDialogStore,
        matureRatedContentNotAllowedDialogStore,
        joinGameText,
        onJoinGame,
        onShowMatureRatedContentNotAllowedDialog,
        onCloseMatureRatedContentWarningDialog,
        getWhatDialogShouldBeShown,
        onShowMatureRatedContentDialog,
      }}
    >
      {children}
    </MatureRatedContentDialogContext.Provider>
  );
}

export function useMatureRatedContentDialogStores(): Pick<
  Context,
  | 'matureRatedContentImplicitAccountDialogStore'
  | 'matureRatedContentNotAllowedDialogStore'
  | 'matureRatedContentWarningDialogStore'
  | 'joinGameText'
  | 'onJoinGame'
  | 'onCloseMatureRatedContentWarningDialog'
> {
  const context = useContext(MatureRatedContentDialogContext);

  if (!context) {
    throw new Error(
      'useMatureRatedContentDialogStores must be used within a MatureRatedContentDialogProvider',
    );
  }

  return context;
}

export function useMatureRatedContentDialog(): Pick<
  Context,
  | 'onShowMatureRatedContentNotAllowedDialog'
  | 'getWhatDialogShouldBeShown'
  | 'onShowMatureRatedContentDialog'
> {
  const context = useContext(MatureRatedContentDialogContext);

  if (!context) {
    throw new Error(
      'useMatureRatedContentDialog must be used within a MatureRatedContentDialogProvider',
    );
  }

  return context;
}
