import { CoreAssets } from '@noice-com/assets-core';
import { useMountTransition, Icon } from '@noice-com/common-ui';
import classNames from 'classnames';
import { forwardRef } from 'react';

import styles from './AvailableBoosterButton.module.css';

import BoosterButtonReadyVfx from '@game-assets/vfx/booster-button-ready-vfx.png';
import { getBoosterIconComponent } from '@game-common/booster';
import { usePlaySound } from '@game-common/sound/hooks';
import { CGAvailableBooster } from '@game-logic/boosters';
import { usePlayerBoosterApply } from '@game-logic/boosters/hooks';
import { usePlayerActiveCard } from '@game-logic/card/hooks';
import { GameSoundKeys } from '@game-types';

export interface Props {
  /** The instance of this booster */
  availableBooster: CGAvailableBooster;
  /** Flag to allow/disallow showing the pulse animation on mount */
  canShowPulse?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
}

export const AvailableBoosterButton = forwardRef<HTMLButtonElement, Props>(
  ({ availableBooster, canShowPulse, isDisabled, onClick }, ref) => {
    const { applyModeActive } = usePlayerBoosterApply();
    const activeCard = usePlayerActiveCard(availableBooster.ownerId);
    const [playHover] = usePlaySound(GameSoundKeys.GenericHover);

    const { withTransitionStyles } = useMountTransition({
      isShown: true,
      duration: 1000,
    });

    const BoosterIcon = getBoosterIconComponent(availableBooster.boosterId);

    const onMouseEnter = () => {
      playHover();
    };

    const hasDarkTheme =
      !availableBooster.isLocallyOwned ||
      (availableBooster.isLocallyOwned && !activeCard) ||
      applyModeActive;

    return (
      <button
        aria-label="Booster"
        className={classNames(styles.boosterWrapper, styles.wrapper, {
          [styles.highlight]: canShowPulse && withTransitionStyles,
          [styles.dark]: hasDarkTheme,
        })}
        data-ftue-anchor={availableBooster.isLocallyOwned ? 'booster-icon' : undefined}
        disabled={isDisabled}
        ref={ref}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        {canShowPulse && withTransitionStyles && (
          <img
            alt=""
            className={styles.boosterButtonReadyVfx}
            src={BoosterButtonReadyVfx}
          />
        )}

        {!applyModeActive || !availableBooster.isLocallyOwned ? (
          <BoosterIcon className={styles.boosterIcon} />
        ) : (
          <Icon
            className={styles.closeIcon}
            icon={CoreAssets.Icons.Close}
          />
        )}
      </button>
    );
  },
);
