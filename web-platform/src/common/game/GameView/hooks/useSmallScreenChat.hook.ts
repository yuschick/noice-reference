import { useCardGameAPI } from '@noice-com/card-game';
import { useMountTransition } from '@noice-com/common-ui';
import { useEffect, useLayoutEffect, useState } from 'react';

interface HookResult {
  isSmallScreenChatMounted: boolean;
  isSmallScreenChatOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface Props {
  forceHide: boolean;
}

export function useSmallScreenChat({ forceHide }: Props): HookResult {
  const { events } = useCardGameAPI();
  const [smallScreenChatOpen, setSmallScreenChatOpen] = useState(false);

  const onOpen = () => setSmallScreenChatOpen(true);
  const onClose = () => setSmallScreenChatOpen(false);

  useEffect(() => {
    const onChatIconClicked = () => setSmallScreenChatOpen(true);

    events.addListener('onChatIconClicked', onChatIconClicked);

    return () => {
      events.removeListener('onChatIconClicked', onChatIconClicked);
    };
  }, [events]);

  useLayoutEffect(() => {
    if (!forceHide) {
      return;
    }

    setSmallScreenChatOpen(false);
  }, [forceHide]);

  const { withTransitionStyles, showTransitionChild } = useMountTransition({
    isShown: smallScreenChatOpen,
    duration: '--noi-duration-quick',
  });

  return {
    isSmallScreenChatMounted: showTransitionChild,
    isSmallScreenChatOpen: withTransitionStyles,
    onOpen,
    onClose,
  };
}
