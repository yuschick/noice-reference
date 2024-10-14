import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { BridgedWebview } from '@components/BridgedWebview';
import { Header, HEADER_TOP_ROW_HEIGHT } from '@components/List/Header';
import { PageLayout } from '@components/PageLayout';
import { PageSkeletonLoader } from '@components/PageSkeletonLoader';
import { colors } from '@constants/styles';
import {
  AuthenticatedNavigationHookProps,
  AuthenticatedScreenProps,
} from '@navigators/routes';

const TOP_INSET_OFFSET = 48;

export const StoreItemView = ({
  route: {
    params: { itemUrl },
  },
}: AuthenticatedScreenProps<'storeItem'>) => {
  const scrollY = useSharedValue(0);
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();

  const [webviewLoaded, setWebviewLoaded] = useState(false);

  return (
    <PageLayout.Simple>
      <BridgedWebview
        contentInset={{ top: HEADER_TOP_ROW_HEIGHT + TOP_INSET_OFFSET }}
        decelerationRate="normal"
        showsHorizontalScrollIndicator={false}
        style={s.webView}
        webviewSource={`embed${itemUrl}`}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y + HEADER_TOP_ROW_HEIGHT;
        }}
        onWebViewPageLoaded={setWebviewLoaded}
      />

      {!webviewLoaded && (
        <PageSkeletonLoader
          listCardCount={1}
          listCardHeight={Dimensions.get('window').height}
          showTitle={false}
        />
      )}

      <Header
        scrollY={scrollY}
        onHeaderLeftPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
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
