import { makeLoggers } from '@noice-com/utils';
import { NativeModules, Platform } from 'react-native';
const { NoicePurchasesModule } = NativeModules;

export type InAppPurchaseProduct = {
  id: string;
  description: string;
  displayName: string;
  displayPrice: string;
  isFamilyShareable: boolean;
  price: number;
  type: string;
};

export type InAppPurchaseResult = 'COMPLETE' | 'USER_CANCELLED' | 'PENDING' | 'FAILED';

type NoicePurchasesModuleType = {
  getProducts: (productIdentifiers: string[]) => Promise<InAppPurchaseProduct[]>;
  purchaseProduct: (productId: string, tokenId: string) => Promise<InAppPurchaseResult>;
};

const logger = makeLoggers('NoicePurchases');

export const NoicePurchases: NoicePurchasesModuleType = {
  getProducts: async (productIdentifiers: string[]) => {
    if (Platform.OS !== 'ios') {
      logger.logError('[getProducts] is not implemented on this platform');
      return [];
    }

    return NoicePurchasesModule.getProducts(productIdentifiers);
  },
  purchaseProduct: async (productId: string, tokenId: string) => {
    if (Platform.OS !== 'ios') {
      logger.logError('[purchaseProduct] is not implemented on this platform');
      return '';
    }

    return NoicePurchasesModule.purchaseProduct(productId, tokenId);
  },
};
