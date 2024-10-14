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
import EventEmitter from 'eventemitter3';

interface StreamEventMap {
  onEmoteEvent: [EmoteEvent];
  onEmojiEvent: [EmojiEvent];
  onCardSetActiveEvent: [CardSetActiveEvent];
  onBoosterRequestedEvent: [BoosterRequestedEvent];
  onBoosterUsedEvent: [BoosterUsedEvent];
  onChatMessageSentEvent: [ChatMessageSentEvent];
  onGroupCheerEvent: [GroupCheerEvent];
  onMatchEndEvent: [MatchEndEvent];
  onMatchStartEvent: [];
  onAvatarUpdateEvent: [AvatarConfigsAvatar];
}

export class StreamEventEmitter extends EventEmitter<StreamEventMap> {}
