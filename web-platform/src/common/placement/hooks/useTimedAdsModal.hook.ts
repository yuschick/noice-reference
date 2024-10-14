import {
  FTUEActionType,
  useAnalytics,
  useToggle,
  useTriggerFTUEAction,
} from '@noice-com/common-ui';

import { TIMED_REWARDS_PLACEMENT_ID } from '../constants';
import { AdContext } from '../types';

import { useTimedAdsSounds } from './useTimedAdsSounds.hook';

interface HookResult {
  isOpen: boolean;
  onOpen(): void;
  onClose(): void;
}

export function useTimedAdsModal(context: AdContext): HookResult {
  const { trackEvent } = useAnalytics();
  const triggerFTUEAction = useTriggerFTUEAction();

  const [isOpen, _, open, close] = useToggle(false);
  const { playClickSound, playCloseAdSound } = useTimedAdsSounds();

  const onClose = () => {
    trackEvent({
      clientTimedAdsClosed: {
        pathname: window.location.pathname,
        placementId: TIMED_REWARDS_PLACEMENT_ID,
      },
    });

    playCloseAdSound();
    close();
  };

  const onOpen = () => {
    trackEvent({
      clientTimedAdsOpened: {
        pathname: window.location.pathname,
        placementId: TIMED_REWARDS_PLACEMENT_ID,
        context,
      },
    });
    playClickSound();
    triggerFTUEAction(FTUEActionType.TimedAdsOpen);
    open();
  };

  return {
    isOpen,
    onOpen,
    onClose,
  };
}
