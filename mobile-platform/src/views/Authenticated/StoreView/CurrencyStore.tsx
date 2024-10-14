import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import Animated, { ScrollHandlerProcessed } from 'react-native-reanimated';

import { HardCurrencyCard } from './HardCurrencyCard';

import { EmptyState } from '@components/EmptyState';
import { Gutter } from '@components/Gutter';
import { useLargeHeaderOffset } from '@components/PageHeaders/LargeHeader';
import { PageLayout } from '@components/PageLayout';
import { PageSkeletonLoader } from '@components/PageSkeletonLoader';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import {
  ConsumableProduct,
  useConsumablePurchases,
} from '@hooks/purchases/useConsumablePurchases.hook';
import { usePurchaseConsumable } from '@hooks/purchases/usePurchaseConsumable.hook';
import { IconAssets } from '@utils/icons';

type Props = {
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
};

export const CurrencyStore = ({ scrollHandler }: Props) => {
  const headerOffset = useLargeHeaderOffset();
  const footerHeight = useBottomTabBarHeight();

  const { refetchPlatformProducts, consumableProducts, isLoadingProducts } =
    useConsumablePurchases();
  const { purchaseConsumableProduct, nativePurchaseInProgressId } =
    usePurchaseConsumable();

  const renderItem = ({ item }: { item: ConsumableProduct }) => {
    return (
      <HardCurrencyCard
        isInProgress={nativePurchaseInProgressId === item.id}
        product={item}
        onPress={() => purchaseConsumableProduct(item, refetchPlatformProducts)}
      />
    );
  };

  const itemSeparatorComponent = () => <Gutter height={8} />;

  const listHeaderComponent = (
    <VStack>
      <HStack style={s.titleContainer}>
        <Gutter width={16} />
        <Typography
          fontSize="xl"
          fontWeight="bold"
          uppercase
        >
          Credits
        </Typography>
      </HStack>
      <Gutter height={24} />
    </VStack>
  );

  const headerHeight = headerOffset - 48;

  if (!consumableProducts?.length && !isLoadingProducts) {
    return (
      <PageLayout.Simple>
        <Gutter height={headerHeight + 16} />
        <EmptyState
          description="Could not fetch products"
          icon={
            <IconAssets.Alert
              color="white"
              height={48}
              width={48}
            />
          }
          title="Oops! Something went wrong"
        />
      </PageLayout.Simple>
    );
  }

  if (isLoadingProducts) {
    <PageLayout.Simple>
      <Gutter height={headerHeight + 16} />
      <PageSkeletonLoader
        listCardCount={4}
        listCardHeight={200}
        listCardPadding={8}
        showTitle={false}
      />
    </PageLayout.Simple>;
  }

  return (
    <PageLayout.Simple>
      <Animated.FlatList
        ItemSeparatorComponent={itemSeparatorComponent}
        ListFooterComponent={<Gutter height={footerHeight + 16 + headerHeight} />}
        ListHeaderComponent={listHeaderComponent}
        contentContainerStyle={s.listContainer}
        data={consumableProducts}
        renderItem={renderItem}
        style={{ paddingTop: headerHeight }}
        onScroll={scrollHandler}
      />
    </PageLayout.Simple>
  );
};

const s = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
  },
  titleContainer: {
    paddingVertical: 12,
    borderLeftColor: colors.greenMain,
    borderLeftWidth: 2,
  },
});
