import { CoreAssets } from '@noice-com/assets-core';
import { ChannelLogo, NoiceLogo } from '@noice-com/common-ui';

import { ChatDrawer, ChatDrawerProps } from '../ChatDrawer';

import { EmojiCategory as EmojiCategoryComponent } from './EmojiCategory/EmojiCategory';
import styles from './EmojiDrawer.module.css';
import { useEmojiDrawerEmojis } from './hooks';

import { LastUsedEmojisLocalStorage } from '@chat-classes';
import { InventoryEmojiFragment } from '@chat-gen';

export type EmojiDrawerProps = ChatDrawerProps & {
  onEmojiClicked(emojiLabel: InventoryEmojiFragment['label']): void;
};

export function EmojiDrawer({
  showDrawer,
  className,
  onEmojiClicked,
  onOutsideClick,
  outsideClickExemptions,
}: EmojiDrawerProps) {
  const { emojisByChannel, noiceEmojis, lastUsedEmojis } = useEmojiDrawerEmojis({
    isDrawerOpen: showDrawer,
  });

  const onEmojiClick = (emoji: string) => {
    LastUsedEmojisLocalStorage.AddNewEmoji(emoji);
    onEmojiClicked(emoji);
  };

  return (
    <ChatDrawer
      className={className}
      outsideClickExemptions={outsideClickExemptions}
      showDrawer={showDrawer}
      onOutsideClick={onOutsideClick}
    >
      <input
        className={styles.searchInput}
        placeholder="Search for emojis (not functional)"
        type="text"
        disabled
      />

      {!!lastUsedEmojis.length && (
        <EmojiCategoryComponent
          emojis={lastUsedEmojis}
          title={
            <>
              <CoreAssets.Icons.SpeedUp className={styles.speedupIcon} /> Recently used
            </>
          }
          onEmojiClicked={onEmojiClick}
        />
      )}

      {emojisByChannel.map(({ channel, emojis }) => (
        <EmojiCategoryComponent
          emojis={emojis}
          key={channel.name}
          title={
            <>
              <ChannelLogo
                channel={channel}
                size="xs"
              />
              {channel.name}
            </>
          }
          onEmojiClicked={onEmojiClick}
        />
      ))}

      {!!noiceEmojis.length && (
        <EmojiCategoryComponent
          emojis={noiceEmojis}
          title={
            <>
              <div className={styles.noiceLogoContainer}>
                <NoiceLogo
                  theme="spectrum"
                  variant="mark"
                />
              </div>
              Noice
            </>
          }
          onEmojiClicked={onEmojiClick}
        />
      )}
    </ChatDrawer>
  );
}
