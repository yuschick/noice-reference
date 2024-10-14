import { Image } from 'expo-image';
import { useMemo } from 'react';
import { Insets, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ChannelLogo } from '@components/ChannelLogo';
import { Gutter } from '@components/Gutter';
import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { EmojiCategory, EmojiDefinition, EmojisByChannel } from '@hooks/chat/types/emoji';
import { Haptic } from '@utils/haptic';
import { IconAssets } from '@utils/icons';
import { NoiceLogo } from '@utils/icons/registry';

interface Props {
  onAddEmoji: (label: string) => void;
  onOpenKeyboard: () => void;
  onCloseEmojiDrawer: () => void;
  height: number;
  recentEmojis?: EmojiDefinition[];
  emojisByChannel: EmojisByChannel;
  emojisByCategory: EmojiCategory[];
}

const buttonHitslop: Insets = { left: 32, right: 32, top: 16, bottom: 16 };

export const StreamChatEmojiDrawer = ({
  onAddEmoji,
  onOpenKeyboard,
  onCloseEmojiDrawer,
  height,
  recentEmojis,
  emojisByChannel,
  emojisByCategory,
}: Props) => {
  const addEmoji = (label: string) => {
    Haptic.impactLight();
    onAddEmoji(label);
  };

  const recentReversed = useMemo(() => recentEmojis?.reverse(), [recentEmojis]);

  return (
    <Animated.View
      entering={FadeInDown.delay(150)}
      style={{ height }}
    >
      <Gutter height={8} />
      <ScrollView
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: 0,
          minIndexForVisible: 0,
        }}
      >
        {/* Recents */}
        {!!recentEmojis?.length && (
          <View style={s.section}>
            <Gutter height={16} />
            <HStack
              alignItems="center"
              style={s.titleRow}
            >
              <IconAssets.BoosterSpeedUp
                color={colors.textSecondary}
                height={20}
                width={20}
              />
              <Gutter width={2} />
              <Typography style={s.categoryTitle}>Recently used</Typography>
            </HStack>
            <Gutter height={8} />
            <HStack style={s.emojiContainer}>
              {recentReversed?.map((emojiData) => (
                <StreamChatEmoji
                  key={'recently-used-emoji-' + emojiData.itemId}
                  source={emojiData.source}
                  onPress={() => addEmoji(emojiData.label)}
                />
              ))}
            </HStack>
          </View>
        )}
        {/* Channel emojis */}
        {emojisByChannel.map((channel) => (
          <View
            key={`emoji-channel-` + channel.channel.name}
            style={s.section}
          >
            <Gutter height={16} />
            <HStack
              alignItems="center"
              style={s.titleRow}
            >
              <ChannelLogo
                logo={channel.channel.logo}
                name={channel.channel.name}
                size="small"
              />
              <Gutter width={2} />
              <Typography style={s.categoryTitle}>{channel.channel.name}</Typography>
            </HStack>
            <Gutter height={8} />
            <HStack style={s.emojiContainer}>
              {channel.emojis.map((emojiData) => (
                <StreamChatEmoji
                  key={channel.channel.id + '-' + emojiData.emoji.itemId}
                  source={emojiData.emoji.source}
                  onPress={() => addEmoji(emojiData.emoji.label)}
                />
              ))}
            </HStack>
          </View>
        ))}
        {/* Category emojis */}
        {emojisByCategory.map((category) => (
          <View
            key={`emoji-category-` + category.title}
            style={
              //don't apply style on last
              emojisByCategory.indexOf(category) === emojisByCategory.length - 1
                ? s.noBorderSection
                : s.section
            }
          >
            <Gutter height={16} />
            <HStack
              alignItems="center"
              style={s.titleRow}
            >
              {/* TODO: we currently only have Noice default emojis
                  in categories */}
              <NoiceLogo
                height={16}
                width={16}
              />
              <Gutter width={2} />
              <Typography style={s.categoryTitle}>{category.title}</Typography>
            </HStack>
            <Gutter height={8} />
            <HStack style={s.emojiContainer}>
              {category.emojis.map((emojiData) => (
                <StreamChatEmoji
                  key={category.title + '-' + emojiData.emoji.itemId}
                  source={emojiData.emoji.source}
                  onPress={() => addEmoji(emojiData.emoji.label)}
                />
              ))}
            </HStack>
            <Gutter height={16} />
          </View>
        ))}
      </ScrollView>
      <HStack
        justifyContent="space-between"
        style={s.bottomRow}
      >
        <TouchableOpacity
          hitSlop={buttonHitslop}
          onPress={onOpenKeyboard}
        >
          <IconAssets.Keyboard
            color={colors.textLightSecondary}
            height={24}
            width={24}
          />
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={buttonHitslop}
          onPress={onCloseEmojiDrawer}
        >
          <IconAssets.ChevronRight
            color={colors.white}
            height={20}
            style={s.arrow}
            width={20}
          />
        </TouchableOpacity>
      </HStack>
    </Animated.View>
  );
};

export const StreamChatEmoji = ({
  source,
  onPress,
}: {
  source: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={{ uri: source }}
        style={s.emojiIcon}
      />
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  section: {
    paddingBottom: 16,
    borderBottomColor: colors.whiteTransparent10,
    borderBottomWidth: 1,
  },
  noBorderSection: {
    paddingBottom: 16,
  },
  categoryTitle: {
    marginLeft: 6,
  },
  arrow: {
    transform: [{ rotateZ: '90deg' }],
  },
  emojiContainer: {
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 8,
  },
  emojiIcon: {
    width: 32,
    height: 32,
  },
  bottomRow: {
    borderTopColor: colors.gray850,
    borderTopWidth: 2,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  titleRow: {
    paddingVertical: 6,
  },
});
