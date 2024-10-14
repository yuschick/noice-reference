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

export const CollectionView = () => {
  const { userId } = useAuth();
  const { scrollY } = useLargeHeaderAnimation();
  const headerOffset = useLargeHeaderOffset();

  const ref = useRef<BridgedWebViewRef>(null);
  const [webviewLoaded, setWebviewLoaded] = useState(false);

  useWebViewScrollToTop(ref);

  return (
    <PageLayout.Simple>
      <BridgedWebview
        decelerationRate="normal"
        ref={ref}
        showsHorizontalScrollIndicator={false}
        style={[s.webView, { marginTop: headerOffset }]}
        webviewSource="embed/collection"
        onWebViewPageLoaded={setWebviewLoaded}
        // content inset does not work with collection view because the modals
        // etc are inline in the same page and this breaks the content inset if
        // the page is scrolled or anything. If later on the page is changed
        // we can re-enable offset and header scrolling.
        /* contentInset={{ top: headerOffset }}
        onScroll={(event) => {
            scrollY.value = event.nativeEvent.contentOffset.y + headerOffset;
          }} */
      />

      {!webviewLoaded && (
        <PageSkeletonLoader
          listCardCount={3}
          listCardHeight={260}
          listCardRowCount={2}
          titleHeight={100}
          titlePaddingBottom={64}
        />
      )}

      <LargeHeader
        scrollY={scrollY}
        title="Collection"
        userId={userId}
        showCurrencies
      />
    </PageLayout.Simple>
  );
};

const s = StyleSheet.create({
  webView: {
    backgroundColor: colors.transparent,
    width: '100%',
    height: '100%',
    flex: 1,
  },
});
