import { GroupEventContentType, GroupEventMessage } from '@noice-com/card-game';
import { AutoScrollWrapper } from '@noice-com/common-ui';
import { useMemo } from 'react';

import styles from './GroupEvents.module.css';
import {
  CardFailedMessage,
  CardSuccessMessage,
  CardScavengeMessage,
  BoosterScoredMessage,
  AonDoubleDownMessage,
} from './Messages';

interface Props {
  groupEvents: GroupEventMessage[];
  isHidden: boolean;
}

export function GroupEvents({ groupEvents, isHidden }: Props) {
  const groupEventElements = useMemo(
    () =>
      groupEvents.map(({ id, content, contentType }) => {
        if (contentType === GroupEventContentType.CardSuccess) {
          return (
            <CardSuccessMessage
              boosters={content.activatedBoosters}
              cardId={content.cardId}
              cardOwnerId={content.cardOwnerId}
              isBestPlay={content.isBestPlay}
              key={id}
              points={content.points}
            />
          );
        }

        if (contentType === GroupEventContentType.CardFailure) {
          return (
            <CardFailedMessage
              boosters={content.activatedBoosters}
              cardId={content.cardId}
              cardOwnerId={content.cardOwnerId}
              key={id}
            />
          );
        }

        if (contentType === GroupEventContentType.CardScavenge) {
          return (
            <CardScavengeMessage
              boosters={content.activatedBoosters}
              cardId={content.cardId}
              cardOwnerId={content.cardOwnerId}
              key={id}
              points={content.cardOwnerPoints}
              wasSwitchedOut={content.wasSwitchedOut}
            />
          );
        }

        if (contentType === GroupEventContentType.BoosterScored) {
          return (
            <BoosterScoredMessage
              boosterId={content.booster}
              boosterOwnerId={content.boosterOwnerId}
              cardId={content.cardId}
              key={id}
              points={content.points}
            />
          );
        }

        if (contentType === GroupEventContentType.AonDoubleDown) {
          return (
            <AonDoubleDownMessage
              attempt={content.currentTry}
              cardId={content.cardId}
              cardOwnerId={content.cardOwnerId}
              key={id}
              maxTries={content.maxTries}
            />
          );
        }
      }),
    [groupEvents],
  );

  return (
    <AutoScrollWrapper
      className={styles.container}
      triggerValue={isHidden ? 0 : groupEvents.length}
    >
      <div className={styles.wrapper}>{groupEventElements}</div>
    </AutoScrollWrapper>
  );
}
