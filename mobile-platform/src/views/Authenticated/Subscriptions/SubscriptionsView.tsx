import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import {
  RefreshControl,
  SectionList,
  SectionListData,
  SectionListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Divider } from '@components/Divider';
import { Gutter } from '@components/Gutter';
import {
  HEADER_BOTTOM_ROW_HEIGHT,
  HEADER_TOP_ROW_HEIGHT,
  Header,
  useHeaderValues,
} from '@components/List/Header';
import { PageLayout } from '@components/PageLayout';
import { SubscriptionSettingItem } from '@components/Subscriptions/SubscriptionsSettingsItem';
import { TopBarBar } from '@components/TopTabBar';
import { Typography } from '@components/Typography';
import { borderRadius, colors } from '@constants/styles';
import {
  SubscriptionChannelSubscriptionProvider,
  SubscriptionChannelSubscriptionState,
  SubscriptionSettingItemSubscriptionFragment,
  useSubscriptionsSettingListQuery,
} from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { useUserRefresh } from '@hooks/useUserRefresh.hook';
import { AuthenticatedScreenProps } from '@navigators/routes';

gql`
  query SubscriptionsSettingList($userId: ID!, $cursor: String) {
    userChannelSubscriptions(userId: $userId, cursor: { first: 5, after: $cursor }) {
      subscriptions {
        id
        state
        ...SubscriptionSettingItemSubscription
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

type Item = SubscriptionSettingItemSubscriptionFragment;

type Section = {
  title: string;
  subtitle: string;
  data: Item[];
};

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList<Item, Section>);

export const SubscriptionsView = ({
  navigation,
}: AuthenticatedScreenProps<'subscriptions'>) => {
  const { top } = useSafeAreaInsets();
  const { scrollY, scrollHandler } = useHeaderValues();
  const tabs = ['active', 'inactive'];
  const [selectedTab, setSelectedTab] = useState('active');
  const { userId } = useAuth();

  const { data: subs, refetch } = useSubscriptionsSettingListQuery({
    ...variablesOrSkip({
      userId,
    }),
  });

  const { isUserRefresh, refresh } = useUserRefresh(refetch);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const subscriptions =
    selectedTab === 'active'
      ? subs?.userChannelSubscriptions?.subscriptions.filter(
          (subscription) =>
            subscription.state === SubscriptionChannelSubscriptionState.StateActive ||
            subscription.state === SubscriptionChannelSubscriptionState.StateCancelled,
        )
      : subs?.userChannelSubscriptions?.subscriptions.filter(
          (subscription) =>
            subscription.state !== SubscriptionChannelSubscriptionState.StateActive &&
            subscription.state !== SubscriptionChannelSubscriptionState.StateCancelled,
        );

  const sections: readonly SectionListData<Item, Section>[] = useMemo(() => {
    const appleSubscriptions =
      subscriptions?.filter(
        (subscription) =>
          subscription.channel.subscription?.provider ===
          SubscriptionChannelSubscriptionProvider.ProviderApple,
      ) ?? [];

    const otherSubscriptions =
      subscriptions?.filter(
        (subscription) =>
          subscription.channel.subscription?.provider !==
          SubscriptionChannelSubscriptionProvider.ProviderApple,
      ) ?? [];

    return [
      {
        title: 'Apple subscriptions',
        subtitle: '',
        data: appleSubscriptions,
      },
      {
        title: 'Other subscriptions',
        subtitle: 'Subscriptions purchased through noice.com',
        data: otherSubscriptions,
      },
    ];
  }, [subscriptions]);

  const renderItem: SectionListRenderItem<Item, Section> = ({ item }) => (
    <SubscriptionSettingItem
      key={item.id}
      subscription={item}
    />
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<Item, Section>;
  }) => {
    if (section.data.length === 0) {
      return null;
    }
    return (
      <>
        {section.title !== 'Apple subscriptions' && (
          <>
            <Gutter height={24} />
            <Divider />
            <Gutter height={24} />
          </>
        )}
        <Typography fontWeight="medium">{section.title}</Typography>
        {!!section.subtitle && (
          <>
            <Gutter height={8} />
            <Typography color="textLightSecondary">{section.subtitle}</Typography>
          </>
        )}
        <Gutter height={16} />
      </>
    );
  };

  const noActiveSubscriptions = sections.every((section) => section.data.length === 0);
  const noInactiveSubscriptions = sections.every((section) => section.data.length === 0);

  return (
    <PageLayout.Simple>
      <AnimatedSectionList
        ListFooterComponent={
          <>
            {selectedTab === 'active' && noActiveSubscriptions && (
              <EmptyState
                description="By subscribing to a channel you’ll support the creator and unlock special channel perks."
                title="You have no active subscription currently."
              />
            )}
            {selectedTab === 'inactive' && noInactiveSubscriptions && (
              <EmptyState title="You have no inactive subscription currently." />
            )}

            <Gutter height={80} />
          </>
        }
        ListHeaderComponent={
          <>
            <Gutter height={HEADER_BOTTOM_ROW_HEIGHT + HEADER_TOP_ROW_HEIGHT + top} />
            <TopBarBar
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              tabs={tabs}
            />
            <Gutter height={24} />
            {selectedTab === 'active' && (
              <Typography
                color="textLightSecondary"
                fontSize="sm"
              >
                Here you can see a list of channels that you have an active subscription.
              </Typography>
            )}
            <Gutter height={24} />
          </>
        }
        contentContainerStyle={s.list}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isUserRefresh}
            onRefresh={refresh}
          />
        }
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        sections={sections}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
      />

      <Header
        goBack={navigation.goBack}
        scrollY={scrollY}
        title="Subscriptions"
      />
    </PageLayout.Simple>
  );
};

const EmptyState = ({ title, description }: { title: string; description?: string }) => (
  <View style={s.emptyState}>
    <Typography
      fontSize="md"
      fontWeight="medium"
    >
      {title}
    </Typography>
    {!!description && (
      <Typography
        color="textLightSecondary"
        fontSize="sm"
      >
        {description}
      </Typography>
    )}
  </View>
);

const s = StyleSheet.create({
  list: { paddingHorizontal: 16 },
  emptyState: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: colors.violet600,
    borderRadius: borderRadius.radiusMd,
    rowGap: 8,
  },
});
