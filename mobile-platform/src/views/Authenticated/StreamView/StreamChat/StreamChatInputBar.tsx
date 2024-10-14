import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import { StreamChatEmojiDrawer } from './StreamChatEmojiDrawer';

import { ButtonIcon } from '@components/ButtonIcon';
import { Gutter } from '@components/Gutter';
import { HStack } from '@components/Stack/HStack';
import { borderRadius, colors, typography } from '@constants/styles';
import { EmojiDefinition } from '@hooks/chat/types/emoji';
import { useUserInventoryEmojis } from '@hooks/chat/useUserInventoryEmojis.hook';
import { useKeyboard } from '@hooks/useKeyboard.hook';
import {
  TextInputWithAttachments,
  TextInputWithAttachmentsRef,
} from '@native/components/TextInputWithAttachment';
import { IconAssets } from '@utils/icons';
import { LocalStorage } from '@utils/storage';

const BUTTON_SIZE = 48;
const MAX_INPUT_LENGTH = 225;

interface Props {
  onMessageChange: (text: string) => void;
  onSend: (consentToModeration?: boolean) => void;
  onCancelModeratedMessage: () => void;
  message?: string;
}

export interface StreamChatInputBarRef {
  hideEmojiDrawer: () => void;
}

const MAX_RECENT_EMOJIS = 6;

export const StreamChatInputBar = forwardRef(
  ({ message, onMessageChange, onSend }: Props, ref) => {
    const textInputRef = useRef<TextInputWithAttachmentsRef>();
    const { emojiList, emojisByChannel, noiceEmojis } = useUserInventoryEmojis();
    const [recentEmojis, setRecentEmojis] = useState<EmojiDefinition[]>([]);
    const { isKeyboardVisible } = useKeyboard();
    const window = useWindowDimensions();
    const [isEmojiDrawerVisible, setIsEmojiDrawerVisible] = useState(false);
    const emojiDrawerHeight = window.height * 0.25;

    const emojiUrlMap = useMemo(
      () =>
        Object.keys(emojiList).reduce(
          (prev, cur) => ({
            ...prev,
            [cur]: emojiList[cur].source,
          }),
          {},
        ),
      [emojiList],
    );

    useEffect(() => {
      if (!emojiList) {
        return;
      }

      const recentEmojiKeys = LocalStorage.getRecentEmojis();
      // it seems that mapping fails at times and maps emojis to null, so filter nulls out
      const recents = recentEmojiKeys.map((key) => emojiList[key]).filter((e) => !!e);

      setRecentEmojis(recents);
    }, [emojiList]);

    useEffect(() => {
      setIsEmojiDrawerVisible((prev) => (prev && isKeyboardVisible ? false : prev));
    }, [isKeyboardVisible]);

    useImperativeHandle(ref, () => ({
      hideEmojiDrawer: () => {
        setIsEmojiDrawerVisible(false);
      },
    }));

    const toggleEmojiDrawer = () => {
      setIsEmojiDrawerVisible((prev) => {
        const enabled = !prev;

        if (enabled) {
          textInputRef.current?.blur();
        }

        return enabled;
      });
    };

    const focusInput = () => {
      textInputRef.current?.focus();
    };

    const onAddEmoji = (tag: string) => {
      const emojiDef = emojiList[tag];

      textInputRef.current?.addAttachment(tag);

      // add to recents
      if (emojiDef || !recentEmojis?.length) {
        if (recentEmojis.find((recent) => recent.label === emojiDef.label)) {
          return;
        }

        recentEmojis?.push(emojiDef);
        const sliceStart = Math.max(0, recentEmojis?.length - MAX_RECENT_EMOJIS);
        const copyRecent = recentEmojis.slice(sliceStart, recentEmojis.length);

        // it seems that at somepoint nulls got in here so filtering them out
        LocalStorage.setRecentEmojis(copyRecent?.filter((e) => !!e).map((e) => e.label));
        setRecentEmojis(copyRecent);
      }
    };

    const sendMessage = () => {
      textInputRef.current?.clear();
      onSend();
    };

    const isEnabled = !!message?.length;
    const sendButtonColor: (keyof typeof colors)[] | keyof typeof colors = isEnabled
      ? ['greenMain', 'tealMain']
      : 'whiteTransparent10';

    return (
      <View style={s.wrapper}>
        <HStack alignItems="flex-end">
          <View style={s.inputContainer}>
            <TextInputWithAttachments
              attachmentSources={emojiUrlMap}
              fontFamily={typography.fontFamily.main}
              fontSize={16}
              maxCharacterLimit={MAX_INPUT_LENGTH}
              placeholderText="Send message"
              placeholderTextColor={colors.textSecondary}
              ref={textInputRef}
              style={s.inputField}
              textColor={colors.white}
              onTextChange={onMessageChange}
            />
            <TouchableOpacity
              style={s.emotePickerButton}
              onPress={toggleEmojiDrawer}
            >
              <IconAssets.Emoji
                color={colors.white}
                height={24}
                width={24}
              />
            </TouchableOpacity>
          </View>
          <Gutter width={8} />
          <ButtonIcon
            backgroundColor={sendButtonColor}
            disabled={!message}
            style={[s.sendMessageButton, isEnabled && s.enabledMessageButton]}
            onPress={sendMessage}
          >
            <IconAssets.Send
              color={isEnabled ? colors.black : colors.textSecondary}
              height={24}
              width={24}
            />
          </ButtonIcon>
        </HStack>
        {isEmojiDrawerVisible && (
          <StreamChatEmojiDrawer
            emojisByCategory={[noiceEmojis]}
            emojisByChannel={emojisByChannel}
            height={emojiDrawerHeight}
            recentEmojis={recentEmojis}
            onAddEmoji={onAddEmoji}
            onCloseEmojiDrawer={toggleEmojiDrawer}
            onOpenKeyboard={focusInput}
          />
        )}
      </View>
    );
  },
);

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
  wrapper: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  sendMessageButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: colors.gray850,
    borderRadius: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enabledMessageButton: {
    backgroundColor: colors.greenMain,
  },
  emotePickerButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingRight: 12,
  },
  inputContainer: {
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 38,
    backgroundColor: colors.gray850,
    borderRadius: borderRadius.radiusLg,
    flex: 1,
  },
  inputField: {
    height: BUTTON_SIZE,
    backgroundColor: colors.transparent,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.md,
    color: colors.textLight,
  },
});
