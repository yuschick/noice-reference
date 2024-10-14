import { CoreAssets } from '@noice-com/assets-core';
import { Icon, IconButton } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, useEffect, useRef } from 'react';

import styles from './ChallengesDialog.module.css';
import {
  CHALLENGE_CLOSE_TRANSITION_DURATION,
  useHandleLockedOverlay,
  useSelectChallenge,
} from './hooks';

import { ChallengesContent, useChallengesData } from '@game-common/challenges';
import { useCardGameUIState } from '@game-context';
import {
  useIsChallengesEnabled,
  useIsChallengesLocked,
} from '@game-logic/challenges/hooks';

export function ChallengesDialog() {
  const { isChallengesLocked } = useIsChallengesLocked();
  const { isChallengesDialogOpen, closeChallengesDialog } = useCardGameUIState();
  const { challenges, isLoading } = useChallengesData();
  const { isEnabled } = useIsChallengesEnabled();
  const { showLockedOverlay } = useHandleLockedOverlay();
  const { selectChallenge } = useSelectChallenge();

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!isEnabled || !dialogRef.current) {
      return;
    }

    if (isChallengesDialogOpen) {
      // Recommended way of using dialogs is to use .close() and .show() methods instead of open attribute
      dialogRef.current.show();
      // Accessibility recommendation: Take focus into newly opened dialog close button
      closeButtonRef.current?.focus();
    } else {
      dialogRef.current.close();
    }
  }, [isChallengesDialogOpen, isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <dialog
      className={classNames(styles.dialog, {
        [styles.showLockedOverlay]: showLockedOverlay,
      })}
      ref={dialogRef}
      style={
        {
          '--dialog-close-transition-duration': `${CHALLENGE_CLOSE_TRANSITION_DURATION}ms`,
        } as CSSProperties
      }
    >
      <article>
        <div className={styles.dialogGrid}>
          <div className={styles.challengesWrapper}>
            <ChallengesContent
              challenges={challenges}
              isChallengeSelectable={!isChallengesLocked}
              isLoading={isLoading}
              selectChallenge={selectChallenge}
            />

            <div className={styles.challengesLockedOverlay}>
              <Icon icon={CoreAssets.Icons.Lock} />
              <span>Challenges locked</span>
            </div>
          </div>

          <div className={styles.closeButtonWrapper}>
            <IconButton
              icon={CoreAssets.Icons.Close}
              label="Close dialog"
              level="secondary"
              ref={closeButtonRef}
              size="md"
              onClick={closeChallengesDialog}
            />
          </div>

          <div className={styles.footer}>
            <span className={styles.footerIconWrapper}>
              <Icon icon={CoreAssets.Icons.MatchChallenges} />
            </span>

            <h3 className={styles.footerTitle}>Match challenges</h3>
            <p className={styles.footerDescription}>
              {!isChallengesLocked
                ? 'Select before the next match starts'
                : 'Cannot be selected during match'}
            </p>
          </div>
        </div>
      </article>
    </dialog>
  );
}
