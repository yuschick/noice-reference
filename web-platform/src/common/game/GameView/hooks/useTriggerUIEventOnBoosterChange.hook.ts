import { useAttachGameDelegate } from '@noice-com/card-game';
import { useChatAPI } from '@noice-com/chat-react-web';
import { useEffect } from 'react';

export function useChatBoosterRequest() {
  const { addBoosterRequest, removeBoosterRequest, clearPlayerBoosterRequests } =
    useChatAPI();
  const { attach } = useAttachGameDelegate();

  useEffect(() => {
    return attach({
      onBoosterRequested(_, { targetUserId, userId }) {
        if (!targetUserId || !userId) {
          return;
        }

        addBoosterRequest(targetUserId, userId);
      },
      onBoosterRequestCancelled(_, { targetUserId, userId }) {
        if (!targetUserId || !userId) {
          return;
        }

        removeBoosterRequest(targetUserId, userId);
      },
      // We clear booster request if card succeeds/fails/switches for player
      onActiveCardSet(_, { userId }) {
        if (!userId) {
          return;
        }

        clearPlayerBoosterRequests(userId);
      },
      onActiveCardFailed(_, { userId }) {
        if (!userId) {
          return;
        }

        clearPlayerBoosterRequests(userId);
      },
      onActiveCardSucceeded(_, { userId }) {
        if (!userId) {
          return;
        }

        clearPlayerBoosterRequests(userId);
      },
    });
  }, [attach, addBoosterRequest, removeBoosterRequest, clearPlayerBoosterRequests]);
}
