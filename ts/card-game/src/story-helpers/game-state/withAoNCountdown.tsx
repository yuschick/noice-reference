import { SetTimeoutId } from '@noice-com/common-ui';
import { MockMatchGroup } from '@noice-com/platform-client/src/testing';
import { Nullable } from '@noice-com/utils';
import { StoryContext } from '@storybook/react';
import { ReactElement, useEffect } from 'react';

import { AON_DECISION_DURATION } from '@game-constants';

interface Props {
  userId: string;
  cardId: string;
  countdownStart: number;
  // @todo improve typing
  onActiveCardSucceeded?: any;
  // @todo improve typing
  onAonPointsCollected?: any;
}

export const withAoNCountdown =
  (
    mockMatchGroup: MockMatchGroup,
    {
      userId,
      cardId,
      countdownStart,
      onActiveCardSucceeded = {},
      onAonPointsCollected = {},
    }: Props,
  ) =>
  (Story: () => ReactElement<unknown, string>, context: StoryContext) => {
    useEffect(() => {
      let timerDuration = countdownStart;
      let timeout: Nullable<SetTimeoutId> = null;
      const interval = setInterval(() => {
        timerDuration -= 1;

        if (timerDuration > 0) {
          mockMatchGroup.triggerEvent('onActiveCardTargetValueChanged', {
            userId,
            cardId,
            timerDuration,
          });
          return;
        }

        mockMatchGroup.triggerEvent('onActiveCardSucceeded', {
          userId,
          points: 500,
          ...onActiveCardSucceeded,
        });
        timeout = setTimeout(
          () =>
            mockMatchGroup.triggerEvent('onAonPointsCollected', {
              userId,
              cardId,
              points: 2000,
              ...onAonPointsCollected,
            }),
          AON_DECISION_DURATION,
        );
        clearInterval(interval);
      }, 1000);

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
        clearInterval(interval);
      };
    }, []);

    return <Story {...context.args} />;
  };
