import { gql } from '@apollo/client';
import {
  Button,
  Dialog,
  TooltipPortal,
  useDialog,
  useIsHoverSupported,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useRef } from 'react';

import { ActiveBoosterWithVFX } from '../../ActiveBoosterWithVFX';

import styles from './ActiveBooster.module.css';
import { ActiveBoosterDialogContent } from './ActiveBoosterDialogContent';
import { ActiveBoosterTooltipContent } from './ActiveBoosterTooltipContent';
import { useActiveBoosterData } from './hooks/useActiveBoosterData.hook';

import { Booster } from '@game-common/booster';
import { ActiveBoosterFragment } from '@game-gen';

export interface Props {
  boosterOwnerId: string;
  cardOwnerId: string;
  replaceBooster?: Nullable<ActiveBoosterFragment>;
  forceShowTooltip?: boolean;
  showVfx?: boolean;
  onVfxCompleted?: () => void;
}

export function ActiveBooster({
  boosterOwnerId,
  cardOwnerId,
  replaceBooster,
  forceShowTooltip,
  showVfx,
  onVfxCompleted,
}: Props) {
  const tooltipAnchor = useRef<HTMLDivElement>(null);
  const replacementTooltipAnchor = useRef<HTMLDivElement>(null);

  const isHoverSupportingDevice = useIsHoverSupported();
  const touchOnlyDeviceDialog = useDialog({
    title: 'Booster',
    options: { inlineSize: 'narrow' },
  });

  const {
    loading,
    cardOwner,
    boosterOwner,
    boosterData: booster,
    boosterTimer,
  } = useActiveBoosterData(cardOwnerId, boosterOwnerId);

  if (loading || !boosterOwner || !cardOwner) {
    return null;
  }

  if (!booster && !replaceBooster) {
    return null;
  }

  const isReplacing = !!booster && !!replaceBooster;

  const onClick = !isHoverSupportingDevice
    ? touchOnlyDeviceDialog.actions.open
    : undefined;
  const WrapperElement = onClick ? 'button' : 'div';

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.isReplacing]: isReplacing,
      })}
    >
      {booster ? (
        <WrapperElement
          className={styles.buttonWrapper}
          onClick={onClick}
        >
          <ActiveBoosterWithVFX
            boosterId={booster.id}
            className={styles.booster}
            forwardRef={tooltipAnchor}
            showVfx={showVfx}
            timer={boosterTimer}
            onVfxCompleted={onVfxCompleted}
          />
        </WrapperElement>
      ) : (
        <div className={styles.emptyBooster} />
      )}

      {replaceBooster && (
        <Booster
          boosterId={replaceBooster.id}
          className={styles.replaceBooster}
          forwardRef={replacementTooltipAnchor}
        />
      )}

      {booster && (
        <Dialog store={touchOnlyDeviceDialog}>
          <Dialog.Header />
          <Dialog.Content>
            <ActiveBoosterDialogContent
              booster={booster}
              boosterOwner={boosterOwner}
              cardOwner={cardOwner}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              fit="container"
              size="lg"
              theme="dark"
              onClick={touchOnlyDeviceDialog.actions.close}
            >
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      )}

      <TooltipPortal
        anchorRef={replaceBooster ? replacementTooltipAnchor : tooltipAnchor}
        disabled={!isHoverSupportingDevice}
        distance={22}
        forceShow={forceShowTooltip}
        offset={-4}
        placement="right-start"
        hideArrow
      >
        <ActiveBoosterTooltipContent
          booster={booster}
          boosterOwner={boosterOwner}
          cardOwner={cardOwner}
          replaceBooster={replaceBooster}
        />
      </TooltipPortal>
    </div>
  );
}

ActiveBooster.fragments = {
  profile: gql`
    fragment ActiveBoosterProfile on ProfileProfile {
      ...ActiveBoosterTooltipContentProfile
      ...ActiveBoosterDialogContentProfile
    }
  `,
  booster: gql`
    fragment ActiveBooster on GameLogicBooster {
      id
      ...ActiveBoosterTooltipContentBooster
      ...ActiveBoosterDialogContentBooster
    }
  `,
};
