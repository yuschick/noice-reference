import {
  Button,
  Checkbox,
  Dialog,
  useAnalytics,
  useAuthenticatedUser,
} from '@noice-com/common-ui';
import { useState } from 'react';

import { useMatureRatedContentDialogStores } from '../../context';

import styles from './MatureRatedContentWarningDialog.module.css';

import {
  FULL_USER_MATURE_RATED_CONTENT_DIALOG_SECTION,
  MATURE_RATED_CONTENT_DIALOG_ACTION_BROWSE_OTHER_GAMES,
  MATURE_RATED_CONTENT_DIALOG_ACTION_JOIN_GAME,
} from '@common/channel/analytics';
import { useConsentWarningSettingMutation } from '@common/user-settings';

export function MatureRatedContentWarningDialog() {
  const {
    matureRatedContentWarningDialogStore,
    joinGameText,
    onJoinGame,
    onCloseMatureRatedContentWarningDialog,
  } = useMatureRatedContentDialogStores();
  const { trackButtonClickEvent } = useAnalytics();
  const [isJoiningGame, setIsJoiningGame] = useState(false);
  const [updateContentWarningsOff, setUpdateContentWarningsOff] = useState(false);

  const { userId } = useAuthenticatedUser();

  const [updateConsentWarningSetting] = useConsentWarningSettingMutation({
    variables: {
      userId,
      showMatureContentWarning: false,
    },
  });

  const onJoinGameButtonClick = async () => {
    trackButtonClickEvent(MATURE_RATED_CONTENT_DIALOG_ACTION_JOIN_GAME, {
      section: FULL_USER_MATURE_RATED_CONTENT_DIALOG_SECTION,
    });
    setIsJoiningGame(true);

    // If checkbox is not checked, join the game
    if (!updateContentWarningsOff) {
      await onJoinGame();
      setIsJoiningGame(false);
      return;
    }

    // If checkbox is checked, update the consent warning setting and join the game
    await updateConsentWarningSetting();

    await onJoinGame();

    setIsJoiningGame(false);
  };

  return (
    <Dialog store={matureRatedContentWarningDialogStore}>
      <Dialog.Content>
        <div className={styles.contentWarningWrapper}>
          <h2>This channel is intended for mature audiences</h2>

          <p>The content may not be appropriate for some users.</p>

          <Checkbox
            disabled={isJoiningGame}
            label="Don't show this anymore"
            name="content-warning"
            onChange={(event) => setUpdateContentWarningsOff(event.target.checked)}
          />
        </div>
      </Dialog.Content>

      <Dialog.Actions>
        <Button
          level="secondary"
          theme="dark"
          onClick={() => {
            trackButtonClickEvent(MATURE_RATED_CONTENT_DIALOG_ACTION_BROWSE_OTHER_GAMES, {
              section: FULL_USER_MATURE_RATED_CONTENT_DIALOG_SECTION,
            });
            onCloseMatureRatedContentWarningDialog();
          }}
        >
          Browse other channels
        </Button>

        <Button
          isLoading={isJoiningGame}
          theme="dark"
          onClick={onJoinGameButtonClick}
        >
          {joinGameText}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
