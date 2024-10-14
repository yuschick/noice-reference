import { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import { BridgedWebview, BridgedWebViewRef } from '@components/BridgedWebview';
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

export const SeasonsView = () => {
  const { userId } = useAuth();
  const { scrollY } = useLargeHeaderAnimation();
  const headerOffset = useLargeHeaderOffset();

  const ref = useRef<BridgedWebViewRef>(null);
  const [webviewLoaded, setWebviewLoaded] = useState(false);

  useWebViewScrollToTop(ref);

  return (
    <PageLayout.Simple>
      <BridgedWebview
        contentInset={{ top: headerOffset }}
        decelerationRate="normal"
        ref={ref}
        style={s.webView}
        webviewSource="embed/seasons"
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y + headerOffset;
        }}
        onWebViewPageLoaded={setWebviewLoaded}
      />

      {!webviewLoaded && (
        <PageSkeletonLoader
          listCardCount={2}
          listCardHeight={260}
          titleHeight={64}
          titleWidth="100%"
        />
      )}

      <LargeHeader
        scrollY={scrollY}
        title="Seasons"
        userId={userId}
        showCurrencies
      />
    </PageLayout.Simple>
  );
};

const s = StyleSheet.create({
  webView: {
    width: '100%',
    flex: 1,
    height: '100%',
    backgroundColor: colors.transparent,
  },
});
