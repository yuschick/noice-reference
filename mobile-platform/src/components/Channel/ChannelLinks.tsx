import { gql } from '@apollo/client';
import { FC } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';

import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { ChannelChannelLinkLinkType, ChannelViewLinksFragment } from '@gen/graphql';
import { IconAssets } from '@utils/icons';
import { openURL } from '@utils/open-url';

type Props = ChannelViewLinksFragment;

const channelPageLinkMap: Record<
  ChannelChannelLinkLinkType,
  { name: string; icon: FC<SvgProps> }
> = {
  [ChannelChannelLinkLinkType.LinkTypeCustom]: {
    name: 'Unknown Link',
    icon: IconAssets.LinkExternal,
  },
  [ChannelChannelLinkLinkType.LinkTypeDiscord]: {
    name: 'Discord',
    icon: IconAssets.Discord,
  },

  [ChannelChannelLinkLinkType.LinkTypeFacebook]: {
    name: 'Facebook',
    icon: IconAssets.Facebook,
  },
  [ChannelChannelLinkLinkType.LinkTypeInstagram]: {
    name: 'Instagram',
    icon: IconAssets.Instagram,
  },
  [ChannelChannelLinkLinkType.LinkTypeTiktok]: {
    name: 'TiKTok',
    icon: IconAssets.Tiktok,
  },
  [ChannelChannelLinkLinkType.LinkTypeTwitter]: {
    name: 'X',
    icon: IconAssets.XTwitter,
  },
  [ChannelChannelLinkLinkType.LinkTypeUnspecified]: {
    name: 'Unknown Link',
    icon: IconAssets.LinkExternal,
  },
  [ChannelChannelLinkLinkType.LinkTypeYoutube]: {
    name: 'Youtube',
    icon: IconAssets.Youtube,
  },
};

export function ChannelViewLinks({ links }: Props) {
  const sortedLinks = [...links].sort((a, b) => {
    const aName = channelPageLinkMap[a.type].name;
    const bName = channelPageLinkMap[b.type].name;

    return aName.localeCompare(bName);
  });

  return (
    <HStack
      spacing={16}
      wrap="wrap"
    >
      {sortedLinks.map((link, key) => {
        const Icon = channelPageLinkMap[link.type].icon;

        return (
          <TouchableOpacity
            key={key}
            onPress={() => openURL(link.url)}
          >
            <HStack spacing={4}>
              <Icon
                color={colors.whiteMain}
                height={16}
                width={16}
              />
              <Typography
                color="textLight"
                fontSize="xs"
                fontWeight="medium"
                style={s.link}
              >
                {channelPageLinkMap[link.type].name}
              </Typography>
            </HStack>
          </TouchableOpacity>
        );
      })}
    </HStack>
  );
}

const s = StyleSheet.create({
  link: {
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
});

ChannelViewLinks.fragments = {
  entry: gql`
    fragment ChannelViewLinks on ChannelChannel {
      links {
        type
        name
        url
      }
    }
  `,
};
