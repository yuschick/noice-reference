import { Image } from 'expo-image';
import { Fragment } from 'react';
import { StyleSheet } from 'react-native';

import { Typography } from '@components/Typography';
import { typography } from '@constants/styles';
import { promptOpenURL } from '@utils/open-url';

const LINE_HEIGHT: keyof typeof typography.lineHeight = 'xl';

export const renderText = (content: string, key: string) => (
  <Fragment key={key}>{content}</Fragment>
);

export const renderMention = (content: string, key: string) => (
  <Typography
    color="greenMain"
    fontWeight="semiBold"
    key={key}
    lineHeight={LINE_HEIGHT}
    style={s.flex}
  >
    {content}{' '}
  </Typography>
);

export const renderLink = (content: string, key: string) => (
  <Fragment key={key}>
    <Typography
      accessibilityHint="Link will open in a browser"
      color="whiteMain"
      fontWeight="medium"
      lineHeight={LINE_HEIGHT}
      style={[s.flex, s.link]}
      onPress={promptOpenURL(content)}
    >
      {content}
    </Typography>
    {/* empty whitespace without underline */}
    <Typography> </Typography>
  </Fragment>
);

export const renderEmoji = (content: string, source: string, key: string) => (
  <Image
    alt={content}
    key={key}
    source={{ uri: source }}
    style={s.emojiIcon}
  />
);

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
  link: {
    textDecorationLine: 'underline',
  },
  emojiIcon: {
    width: 20,
    height: 20,
  },
});
