import { ChannelEventModel } from '@noice-com/chat-react-core';
import { border, spacing } from '@noice-com/design-tokens';
import { Nullable } from '@noice-com/utils';
import { StyleSheet, View } from 'react-native';

import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { UserBadge } from '@components/UserBadge';
import { colors } from '@constants/styles';
import { BadgeBadgeType, ChannelEventContentProfileFragment } from '@gen/graphql';
import { IconAssets } from '@utils/icons';
import { pluralize } from '@utils/strings';
import { getUserIdColor } from '@utils/user-id-color';

interface Props {
  channelId: string;
  content: ChannelEventModel;
}

const getBadge = (model: ChannelEventModel) => {
  if (model.type === 'subscription') {
    return (
      model.user?.badges?.find(
        (badge) => badge.type === BadgeBadgeType.TypeChannelSubscriber,
      ) ?? { type: BadgeBadgeType.TypeChannelSubscriber, level: 0 }
    );
  }

  if (model.type === 'gift-subscription') {
    return (
      model.recipient?.badges?.find(
        (badge) => badge.type === BadgeBadgeType.TypeChannelSubscriber,
      ) ?? { type: BadgeBadgeType.TypeChannelSubscriber, level: 0 }
    );
  }
};

const getTitleLabel = (type: ChannelEventModel['type']) => {
  switch (type) {
    case 'avatar-item-purchase':
      return 'Creator Cosmetic Purchase';
    case 'bundle':
      return 'Premium Bundle Purchase';
    case 'creator-card':
      return 'Creator Card purchase';
    case 'gift-subscription':
      return 'New Gift Subscription';
    case 'subscription':
      return 'New Subscriber';
  }
};

const renderUserLabel = (user: Nullable<ChannelEventContentProfileFragment>) => {
  const userTagColor = getUserIdColor({
    preferredColor: user?.preferredColor,
    userId: user?.userId ?? 'Mysterious Stranger',
  });

  return (
    <Typography
      fontSize="md"
      fontWeight="medium"
      style={{ color: userTagColor }}
    >
      {user?.userId ? user.userTag : 'Mysterious Stranger'}{' '}
    </Typography>
  );
};

const renderCardName = (cardName: string) => (
  <Typography
    color="textLight"
    fontSize="sm"
    fontWeight="medium"
  >
    {cardName}
  </Typography>
);

export const ChannelEventMessage = ({ content }: Props) => {
  const badge = getBadge(content);
  const type = content.type;

  return (
    <View style={s.container}>
      <VStack
        spacing={spacing.base}
        style={s.wrapper}
      >
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
          <Typography
            fontSize="md"
            fontWeight="medium"
          >
            {getTitleLabel(type)}
          </Typography>
        </HStack>

        <Typography>
          {renderUserLabel(content?.user)}

          {content.type === 'bundle' &&
            (!content.creatorCardNames?.length ? (
              <Typography
                color="textLightSecondary"
                fontSize="sm"
              >
                purchased the Premium bundle.
              </Typography>
            ) : (
              !!content.creatorCardNames?.length && (
                <Typography
                  color="textLightSecondary"
                  fontSize="sm"
                >
                  purchased the Premium bundle and acquired{' '}
                  {pluralize(
                    content.creatorCardNames.length,
                    'Creator Card',
                    'the Creator Cards',
                  )}{' '}
                  {renderCardName(content.creatorCardNames.join(', '))}!
                </Typography>
              )
            ))}

          {content.type === 'creator-card' && (
            <Typography
              color="textLightSecondary"
              fontSize="sm"
            >
              purchased a {renderCardName(content.creatorCardName)} Creator Card.
            </Typography>
          )}

          {content.type === 'subscription' && (
            <Typography
              color="textLightSecondary"
              fontSize="sm"
            >
              subscribed to the channel!
            </Typography>
          )}

          {content.type === 'gift-subscription' && (
            <Typography
              color="textLightSecondary"
              fontSize="sm"
            >
              gifted a subscription to {renderUserLabel(content.recipient)}
            </Typography>
          )}
        </Typography>
      </VStack>
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
  wrapper: {
    borderLeftColor: colors.tealMain,
    borderLeftWidth: 2,
    paddingVertical: spacing.base,
    paddingLeft: spacing.base * 3,
  },
});
