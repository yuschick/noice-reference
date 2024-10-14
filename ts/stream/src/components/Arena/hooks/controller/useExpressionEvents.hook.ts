import { AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { AvatarConfigsAvatar } from '@noice-com/schemas/rendering/config.pb';
import {
  ChatMessageSentEvent,
  EmojiEvent,
  EmoteEvent,
  GroupCheerEvent,
} from '@noice-com/schemas/rendering/events.pb';
import { useEffect } from 'react';

import { ArenaControllerType } from '../../types';

import { StreamEventEmitter } from '@stream-classes';

interface Props {
  arenaController: ArenaControllerType;
  eventEmitter: StreamEventEmitter;
}

export function useExpressionEvents({ arenaController, eventEmitter }: Props) {
  useEffect(() => {
    if (!arenaController || !eventEmitter) {
      return;
    }

    const onEmojiEvent = ({ userId, emojiUrl, emojiName }: EmojiEvent) => {
      if (!userId || !emojiUrl || !emojiName) {
        return;
      }

      arenaController.triggerPlayerEmoji({
        playerId: userId,
        url: emojiUrl,
        name: emojiName,
      });
    };

    const onEmoteEvent = ({ animationId, userId }: EmoteEvent) => {
      if (!animationId || !userId) {
        return;
      }

      arenaController.triggerPlayerAnimation({ playerId: userId, animationId });
    };

    const onGroupCheerEvent = ({ participantIds }: GroupCheerEvent) => {
      if (!participantIds || !arenaController) {
        return;
      }

      participantIds.forEach((userId) =>
        arenaController.triggerPlayerAnimation({
          playerId: userId,
          animationCategory: AnimationCategory.CATEGORY_CHEER,
        }),
      );
    };

    const onChatMessageSentEvent = ({ userId }: ChatMessageSentEvent) => {
      if (!userId) {
        return;
      }

      arenaController.triggerPlayerAnimation({
        playerId: userId,
        animationCategory: AnimationCategory.CATEGORY_CHAT_MESSAGE,
      });
    };

    const onAvatarUpdateEvent = (event: AvatarConfigsAvatar) => {
      if (!event.userId) {
        return;
      }

      arenaController.updatePlayer({ playerId: event.userId, avatarConfig: event });
    };

    eventEmitter.addListener('onChatMessageSentEvent', onChatMessageSentEvent);
    eventEmitter.addListener('onEmojiEvent', onEmojiEvent);
    eventEmitter.addListener('onEmoteEvent', onEmoteEvent);
    eventEmitter.addListener('onGroupCheerEvent', onGroupCheerEvent);
    eventEmitter.addListener('onAvatarUpdateEvent', onAvatarUpdateEvent);

    return () => {
      eventEmitter.removeListener('onChatMessageSentEvent', onChatMessageSentEvent);
      eventEmitter.removeListener('onEmojiEvent', onEmojiEvent);
      eventEmitter.removeListener('onEmoteEvent', onEmoteEvent);
      eventEmitter.removeListener('onGroupCheerEvent', onGroupCheerEvent);
      eventEmitter.removeListener('onAvatarUpdateEvent', onAvatarUpdateEvent);
    };
  }, [arenaController, eventEmitter]);
}
