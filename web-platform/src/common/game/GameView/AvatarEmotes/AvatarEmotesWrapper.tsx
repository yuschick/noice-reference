import { AvatarEmotes } from './AvatarEmotes';
import { useAvatarEmotes } from './hooks';

interface Props {
  className?: string;
}

export function AvatarEmotesWrapper({ className }: Props) {
  const { emojis, emotes, recentlyUsed, loading, onEmoteButtonClick } = useAvatarEmotes();

  return (
    <AvatarEmotes
      className={className}
      emojis={emojis}
      emotes={emotes}
      loading={loading}
      recentlyUsed={recentlyUsed}
      onEmoteButtonClick={onEmoteButtonClick}
    />
  );
}
