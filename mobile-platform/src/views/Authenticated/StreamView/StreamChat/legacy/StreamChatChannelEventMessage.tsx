import { border } from '@noice-com/design-tokens';
import { StyleSheet, View } from 'react-native';

import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { UserBadge } from '@components/UserBadge';
import { colors } from '@constants/styles';
import { BadgeBadgeType } from '@gen/graphql';
import { ChannelEventModel } from '@hooks/chat/types/event';
import { IconAssets } from '@utils/icons';
import { pluralize } from '@utils/strings';
import { getUserIdColor } from '@utils/user-id-color';

interface Props {
  channelId: string;
  content: ChannelEventModel['content'];
}

const getBadge = (content: ChannelEventModel['content']) => {
  if (content.type === 'subscription') {
    return (
      content.user?.badges?.find(
        (badge) => badge.type === BadgeBadgeType.TypeChannelSubscriber,
      ) ?? { type: BadgeBadgeType.TypeChannelSubscriber, level: 0 }
    );
  }

  if (content.type === 'gift-subscription') {
    return (
      content.recipient?.badges?.find(
        (badge) => badge.type === BadgeBadgeType.TypeChannelSubscriber,
      ) ?? { type: BadgeBadgeType.TypeChannelSubscriber, level: 0 }
    );
  }
};

export const ChannelEventMessage = ({ content }: Props) => {
  const badge = getBadge(content);
  const type = content.type;

  const userTagColor = getUserIdColor({
    preferredColor: content.user?.preferredColor,
    userId: content?.user?.userId ?? 'Mysterious Stranger',
  });

  return (
    <View style={s.container}>
      <HStack
        alignItems="center"
        spacing={4}
      >
        {(type === 'creator-card' || type === 'bundle') && (
          <IconAssets.Card
            fill={colors.white}
            height={20}
            width={20}
          />
        )}
        {badge && (
          <UserBadge
            badge={badge}
            size={20}
          />
        )}
        <Typography>
          {(type === 'subscription' || type === 'gift-subscription') && (
            <Typography
              fontSize="md"
              fontWeight="medium"
            >
              New Subscriber
            </Typography>
          )}
          {content.type === 'bundle' && <Typography>Premium bundle purchase</Typography>}
          {content.type === 'creator-card' && (
            <Typography>Creator Card purchase</Typography>
          )}
        </Typography>
      </HStack>

      <Typography>
        <Typography
          fontSize="sm"
          style={{ color: userTagColor }}
        >
          {content?.user?.userId ? content.user.userTag : 'Mysterious Stranger'}{' '}
        </Typography>
        {content.type === 'bundle' &&
          (!content.creatorCardNames?.length ? (
            <Typography
              color="textLightSecondary"
              fontSize="sm"
            >
              {' '}
              purchased the Premium bundle.
            </Typography>
          ) : (
            !!content.creatorCardNames?.length && (
              <Typography
                color="textLightSecondary"
                fontSize="sm"
              >
                {' '}
                purchased the Premium bundle and acquired{' '}
                {pluralize(
                  content.creatorCardNames.length,
                  'Creator Card',
                  'the Creator Cards',
                )}{' '}
                <Typography
                  color="textLight"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  {content.creatorCardNames.join(', ')}!
                </Typography>
              </Typography>
            )
          ))}

        {content.type === 'creator-card' && (
          <Typography>
            {' '}
            purchased the Creator Card <Typography>{content.creatorCardName}</Typography>!
          </Typography>
        )}

        {content.type === 'subscription' && (
          <Typography
            color="textLightSecondary"
            fontSize="sm"
          >
            {' '}
            subscribed to the channel!
          </Typography>
        )}
        {content.type === 'gift-subscription' && (
          <Typography
            color="textLightSecondary"
            fontSize="sm"
          >
            gifted a subscription to {content.recipient?.userTag}
          </Typography>
        )}
      </Typography>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.gray850,
    borderRadius: border.radiusSm,
    padding: 8,
    marginBottom: 4,
  },
});
