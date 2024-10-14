import { useCallback, useEffect, useRef, useState } from 'react';

import { AvatarEmoteDef, RecentlyUsedEmote } from '../types';

import { useAppLocalStorage } from '@common/localstorage';

interface HookResult {
  recentlyUsed: RecentlyUsedEmote[];
  onEmoteButtonClick(item: AvatarEmoteDef): void;
}

interface Props {
  emotes: AvatarEmoteDef[];
  emojis: AvatarEmoteDef[];
  onEmoteButtonClick(item: AvatarEmoteDef): void;
}

const isMatch = (emote: AvatarEmoteDef, toMatch: AvatarEmoteDef) =>
  emote.id === toMatch.id && emote.type === toMatch.type;

const buildRecentlyUsedList = (
  storedEmotes: { id: string; type: 'emote' | 'emoji' }[],
  emotes: AvatarEmoteDef[],
  emojis: AvatarEmoteDef[],
): AvatarEmoteDef[] => {
  const [emote1, emote2] = emotes;
  const [emoji1, emoji2] = emojis;
  const defaultEmotes = [emote1, emote2, emoji1, emoji2];

  if (!storedEmotes.length) {
    return defaultEmotes;
  }

  return storedEmotes.map((storedEmote, index) => {
    // we make sure that the emote/emojis still exists that is stored in local storage
    const list = storedEmote.type === 'emote' ? emotes : emojis;
    const emote = list.find((e) => e.id === storedEmote.id);

    return emote ? emote : defaultEmotes[index];
  });
};

const MAX_AMOUNT = 4;

export function useRecentlyUsedAvatarEmotes({
  emotes,
  emojis,
  onEmoteButtonClick,
}: Props): HookResult {
  const orderedRecentlyUsedRef = useRef<RecentlyUsedEmote[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<RecentlyUsedEmote[]>([]);
  const localStorage = useAppLocalStorage();

  // Build recently used list after data fetched
  useEffect(() => {
    if (!emotes.length || !emojis.length) {
      return;
    }

    const storedRecentlyUsed = localStorage.GetValue('avatar-emotes.recently-used');

    const recentlyUsed = buildRecentlyUsedList(storedRecentlyUsed, emotes, emojis);
    const recentlyUsedWithKeyMappings = recentlyUsed
      .filter(Boolean)
      .map((item, index) => ({
        ...item,
        keyBinding: `${index + 1}`,
      }))
      .slice(0, MAX_AMOUNT);

    orderedRecentlyUsedRef.current = recentlyUsedWithKeyMappings;
    setRecentlyUsed([...recentlyUsedWithKeyMappings]);
  }, [emotes, emojis, localStorage]);

  const onEmoteButtonClickWrapper = useCallback(
    (item: AvatarEmoteDef) => {
      onEmoteButtonClick(item);

      if (!orderedRecentlyUsedRef.current.length) {
        return;
      }

      // The clicked item is already in the recently used list
      const alreadyFoundRecentlyUsed = orderedRecentlyUsedRef.current.find((emote) =>
        isMatch(emote, item),
      );

      if (alreadyFoundRecentlyUsed) {
        // update the ordered ref list for future replacements
        orderedRecentlyUsedRef.current = [
          alreadyFoundRecentlyUsed,
          ...orderedRecentlyUsedRef.current.filter(
            (emote) => !isMatch(emote, alreadyFoundRecentlyUsed),
          ),
        ];
        return;
      }

      // Remove the last from ordered recently used list since that will be replaced
      // by the new one
      const recentlyUsedToBeDropped = orderedRecentlyUsedRef.current.pop();

      if (!recentlyUsedToBeDropped) {
        return;
      }

      const newestRecentlyUsed = {
        ...item,
        keyBinding: recentlyUsedToBeDropped.keyBinding,
      };

      // Add the new item as first in the ordered recently used list
      orderedRecentlyUsedRef.current = [
        newestRecentlyUsed,
        ...orderedRecentlyUsedRef.current,
      ];

      // Replace the dropped item with clicked item in the rendered list
      setRecentlyUsed((cur) => {
        const newList = cur
          .map((emote) =>
            isMatch(emote, recentlyUsedToBeDropped) ? newestRecentlyUsed : emote,
          )
          .slice(0, MAX_AMOUNT);
        // Keep the local storage updated
        localStorage.SetValue(
          'avatar-emotes.recently-used',
          newList.map((item) => ({ id: item.id, type: item.type })),
        );
        return newList;
      });
    },
    [onEmoteButtonClick, localStorage],
  );

  return {
    recentlyUsed,
    onEmoteButtonClick: onEmoteButtonClickWrapper,
  };
}
