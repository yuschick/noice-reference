import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useClient } from '@noice-com/common-react-core';
import { makeLoggers } from '@noice-com/utils';
import { StyleSheet } from 'react-native';

import { CurrencyPill } from './CurrencyPill';
import { LoadingView } from './LoadingView';
import { HStack } from './Stack/HStack';

import {
  AdsRewardDescriptionPrizeDescriptionKind,
  useCurrencyInfoRowQuery,
} from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { WalletCurrencyId } from '@utils/currency';

gql`
  query CurrencyInfoRow($userId: ID!) {
    wallet(userId: $userId) {
      wallet {
        currencies {
          currencyId
          currencyAmount
        }
      }
    }
  }
`;

const { logInfo } = makeLoggers('Currency info row');

export const CurrencyInfoRow = () => {
  const { userId } = useAuth();
  const client = useClient();
  const { data, loading, error, refetch } = useCurrencyInfoRowQuery({
    ...variablesOrSkip({ userId }),
    fetchPolicy: 'network-only',
  });
  const currencies = data?.wallet?.wallet.currencies;
  const currencyData =
    currencies?.reduce<Record<string, number>>((prev, cur) => {
      return {
        ...prev,
        [cur.currencyId]: cur.currencyAmount,
      };
    }, {}) ?? {};

  useMountEffect(() => {
    return client.NotificationService.notifications({
      onWalletTransaction: () => {
        logInfo('Wallet transaction notification received.');
        refetch();
      },
    });
  });

  if (error) {
    logInfo('Failed to load currency info query.', error);
    return null;
  }

  if (!loading && !currencyData) {
    logInfo('No currency data available');
    return null;
  }

  return (
    <HStack spacing={8}>
      {loading ? (
        <>
          <LoadingView style={s.currencySkeleton} />
          <LoadingView style={s.currencySkeleton} />
          <LoadingView style={s.currencySkeleton} />
        </>
      ) : (
        <>
          <CurrencyPill
            kind={AdsRewardDescriptionPrizeDescriptionKind.KindCurrency}
            value={currencyData[WalletCurrencyId.HardCurrency]}
          />
          <CurrencyPill
            kind={AdsRewardDescriptionPrizeDescriptionKind.KindExperiencePoints}
            value={currencyData[WalletCurrencyId.SoftCurrency]}
          />
          <CurrencyPill
            kind={AdsRewardDescriptionPrizeDescriptionKind.KindUnspecified}
            value={currencyData[WalletCurrencyId.ReshuffleToken]}
          />
        </>
      )}
    </HStack>
  );
};

const s = StyleSheet.create({
  currencySkeleton: {
    height: 30,
    width: 70,
    borderRadius: 100,
  },
});
