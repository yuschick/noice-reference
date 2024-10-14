import { ArenaConfig, AvatarConfigs } from '@noice-com/schemas/rendering/config.pb';
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
import { CameraTransitionRequest } from '@noice-com/schemas/rendering/transitions.pb';

export type ArenaEvents = {
  onArenaEvent(event: ArenaConfig, eventAgeMs: number): void;
  onAvatarsEvent(event: AvatarConfigs, eventAgeMs: number): void;
  onCameraTransitionRequest(event: CameraTransitionRequest, eventAgeMs: number): void;
  onEmoteEvent(event: EmoteEvent): void;
  onEmojiEvent(event: EmojiEvent): void;
  onCardSetActiveEvent(event: CardSetActiveEvent): void;
  onBoosterRequestedEvent(event: BoosterRequestedEvent): void;
  onBoosterUsedEvent(event: BoosterUsedEvent): void;
  onChatMessageSentEvent(event: ChatMessageSentEvent): void;
  onGroupCheerEvent(event: GroupCheerEvent): void;
  onMatchStartEvent(): void;
  onMatchEndEvent(event: MatchEndEvent): void;
};
