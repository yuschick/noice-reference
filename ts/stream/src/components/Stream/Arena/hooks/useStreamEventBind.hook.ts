import { AvatarConfigsAvatar } from '@noice-com/schemas/rendering/config.pb';
import {
  BoosterRequestedEvent,
  BoosterUsedEvent,
  CardSetActiveEvent,
  ChatMessageSentEvent,
  EmojiEvent,
  EmoteEvent,
  GroupCheerEvent,
  MatchEndEvent,
} from '@noice-com/schemas/rendering/events.pb';
import { Nullable } from '@noice-com/utils';
import { useEffect } from 'react';

import { ArenaHandlerType } from '../types';

import { StreamEventEmitter } from '@stream-classes';
import { StreamProps } from '@stream-types';

interface Props {
  eventEmitter: StreamEventEmitter;
  handler: ArenaHandlerType;
  streamProps: StreamProps;
  isArenaHidden: boolean;
  groupId: Nullable<string>;
}

export function useStreamEventBind({
  eventEmitter,
  handler,
  streamProps,
  isArenaHidden,
  groupId,
}: Props) {
  useEffect(() => {
    if (!eventEmitter || !handler) {
      return;
    }

    const onBoosterRequestedEvent = (event: BoosterRequestedEvent) =>
      handler.onBoosterRequestedEvent(event);
    const onBoosterUsedEvent = (event: BoosterUsedEvent) =>
      handler.onBoosterUsedEvent(event);
    const onCardSetActiveEvent = (event: CardSetActiveEvent) =>
      handler.onCardSetActiveEvent(event);
    const onChatMessageSentEvent = (event: ChatMessageSentEvent) =>
      handler.onChatMessageSentEvent(event);
    const onEmojiEvent = (event: EmojiEvent) => handler.onEmojiEvent(event);
    const onEmoteEvent = (event: EmoteEvent) => handler.onEmoteEvent(event);
    const onGroupCheerEvent = (event: GroupCheerEvent) =>
      handler.onGroupCheerEvent(event);
    const onMatchEndEvent = (event: MatchEndEvent) => handler.onMatchEndEvent(event);
    const onMatchStartEvent = () => handler.onMatchStartEvent();
    const onAvatarUpdateEvent = (event: AvatarConfigsAvatar) =>
      handler.onAvatarUpdateEvent(event);

    eventEmitter.addListener('onBoosterRequestedEvent', onBoosterRequestedEvent);
    eventEmitter.addListener('onBoosterUsedEvent', onBoosterUsedEvent);
    eventEmitter.addListener('onCardSetActiveEvent', onCardSetActiveEvent);
    eventEmitter.addListener('onChatMessageSentEvent', onChatMessageSentEvent);
    eventEmitter.addListener('onEmojiEvent', onEmojiEvent);
    eventEmitter.addListener('onEmoteEvent', onEmoteEvent);
    eventEmitter.addListener('onGroupCheerEvent', onGroupCheerEvent);
    eventEmitter.addListener('onMatchEndEvent', onMatchEndEvent);
    eventEmitter.addListener('onMatchStartEvent', onMatchStartEvent);
    eventEmitter.addListener('onAvatarUpdateEvent', onAvatarUpdateEvent);

    return () => {
      eventEmitter.removeListener(
        'onBoosterRequestedEvent',
        handler.onBoosterRequestedEvent,
      );
      eventEmitter.removeListener('onBoosterUsedEvent', onBoosterUsedEvent);
      eventEmitter.removeListener('onCardSetActiveEvent', onCardSetActiveEvent);
      eventEmitter.removeListener('onChatMessageSentEvent', onChatMessageSentEvent);
      eventEmitter.removeListener('onEmojiEvent', onEmojiEvent);
      eventEmitter.removeListener('onEmoteEvent', onEmoteEvent);
      eventEmitter.removeListener('onGroupCheerEvent', onGroupCheerEvent);
      eventEmitter.removeListener('onMatchEndEvent', onMatchEndEvent);
      eventEmitter.removeListener('onMatchStartEvent', onMatchStartEvent);
      eventEmitter.removeListener('onAvatarUpdateEvent', onAvatarUpdateEvent);
    };
  }, [eventEmitter, handler]);

  useEffect(() => {
    if (!streamProps.arena.value || !handler) {
      return;
    }

    handler.onArenaEvent(streamProps.arena.value, 0);
  }, [streamProps.arena, handler]);

  useEffect(() => {
    if (!streamProps.avatars.value || !handler) {
      return;
    }

    handler.onAvatarsEvent(streamProps.avatars.value, 0);
  }, [streamProps.avatars, handler]);

  useEffect(() => {
    handler?.setArenaHidden(isArenaHidden);
  }, [handler, isArenaHidden]);

  useEffect(() => {
    if (!groupId) {
      return;
    }

    handler?.setLocalGroupID(groupId);
  }, [handler, groupId]);
}
