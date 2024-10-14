import { useBooleanFeatureFlag } from '@noice-com/common-react-core';
import { makeLoggers } from '@noice-com/utils';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import { CurrencyStore } from './CurrencyStore';

import { BridgedWebview, BridgedWebViewRef } from '@components/BridgedWebview';
import { PageTabBar } from '@components/PageContentWithTabs/PageTabBar';
import { Tab } from '@components/PageContentWithTabs/TabButton';
import {
  LargeHeader,
  useLargeHeaderAnimation,
  useLargeHeaderOffset,
} from '@components/PageHeaders/LargeHeader';
import { PageLayout } from '@components/PageLayout';
import { PageSkeletonLoader } from '@components/PageSkeletonLoader';
import { colors } from '@constants/styles';
import { useAuth } from '@hooks/useAuth.hook';
import useWebViewScrollToTop from '@hooks/useWebViewScrollToTop';
import { IconAssets } from '@utils/icons';

const { logError } = makeLoggers('StoreView');

const tabs: Tab[] = [
  {
    index: 0,
    name: 'Card Packs',
    icon: (
      <IconAssets.Card
        fill={colors.white}
        height={20}
        width={20}
      />
    ),
  },
  {
    index: 1,
    name: 'Currency',
    icon: (
      <IconAssets.Star
        fill={colors.white}
        height={24}
        width={24}
      />
    ),
  },
];

export const StoreView = () => {
  const [hardCurrenciesFlagEnabled, isHardCurrenciesFlagLoading] = useBooleanFeatureFlag(
    'mobile_hardCurrencyPurchases',
    false,
  );
  const { userId } = useAuth();
  const { scrollY, scrollHandler } = useLargeHeaderAnimation();
  const headerOffset = useLargeHeaderOffset();
  const navigation = useNavigation();

  const ref = useRef<BridgedWebViewRef>(null);
  const [webviewLoaded, setWebviewLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]);

  useWebViewScrollToTop(ref);

  useEffect(() => {
    navigation.addListener('focus', () => {
      ref.current?.reload();
      ref.current?.recreateBridgeInstance();
    });
  }, [navigation]);

  return (
    <PageLayout.Simple>
      {selectedTab.index === 0 && (
        <BridgedWebview
          contentInset={{ top: headerOffset }}
          decelerationRate="normal"
          ref={ref}
          showsHorizontalScrollIndicator={false}
          style={s.webView}
          webviewSource="embed/store"
          onError={logError}
          onScroll={(event) => {
            scrollY.value = event.nativeEvent.contentOffset.y + headerOffset;
          }}
          onWebViewPageLoaded={setWebviewLoaded}
        />
      )}

      {selectedTab.index === 1 && <CurrencyStore scrollHandler={scrollHandler} />}

      {!webviewLoaded && selectedTab.index === 0 && (
        <PageSkeletonLoader
          listCardCount={4}
          listCardHeight={260}
          listCardPadding={16}
          titleHeight={150}
          titlePaddingBottom={16}
          titlePaddingTop={64}
          titleWidth="100%"
          showTitle
        />
      )}

      <LargeHeader
        extraContent={
          !isHardCurrenciesFlagLoading &&
          hardCurrenciesFlagEnabled && (
            <PageTabBar
              selectedTab={selectedTab.name}
              tabs={tabs}
              onChangeTab={setSelectedTab}
            />
          )
        }
        scrollY={scrollY}
        title="Store"
        userId={userId}
        showCurrencies
      />
    </PageLayout.Simple>
  );
};

const s = StyleSheet.create({
  webView: {
    overflow: 'visible',
    backgroundColor: colors.transparent,
    width: '100%',
    height: '100%',
    flex: 1,
  },
});
