import { Emotes } from './Emotes';

import { useStreamAvatarEmotes } from '@stream-hooks';

const allowedEmotes: string[] = [
  'emote-bow-1',
  'emote-wave-two-hands-1',
  'emote-excited-2',
  'emote-salute-1',
  'emote-boxing-1',
];

export function EmotesWrapper() {
  const { emotes, onEmoteButtonClick } = useStreamAvatarEmotes();

  const emoteList = emotes.filter((emote) => allowedEmotes.includes(emote.id));

  return (
    <Emotes
      emotes={emoteList}
      onEmoteButtonClick={onEmoteButtonClick}
    />
  );
}
