import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Alert } from 'react-native';

import { ButtonLarge } from '@components/ButtonLarge';
import { FormSheetModalLayout } from '@components/FormSheetModalLayout';
import { links } from '@constants/links';
import {
  SubscriptionChannelSubscriptionProvider,
  useManageSubscriptionQuery,
} from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { AuthenticatedScreenProps } from '@navigators/routes';
import { openURL } from '@utils/open-url';

gql`
  query ManageSubscription($channelId: ID!, $userId: ID!) {
    userChannelSubscription(channelId: $channelId, userId: $userId) {
      provider
    }
  }
`;
export const ManageSubscriptionModal = ({
  route: {
    params: { channelId },
  },
}: AuthenticatedScreenProps<'manageSubscription'>) => {
  const { userId } = useAuth();

  const { data: { userChannelSubscription } = {} } = useManageSubscriptionQuery({
    ...variablesOrSkip({ channelId, userId }),
  });

  const manageSubscription = () => {
    if (
      userChannelSubscription?.provider ===
      SubscriptionChannelSubscriptionProvider.ProviderApple
    ) {
      openURL(links.manageSubscriptions);
    } else {
      Alert.alert(
        'Cancel subscription',
        'To cancel this subscription, navigate to your user settings on the web browser to manage your subscriptions.',
        [{ text: 'OK' }],
      );
    }
  };

  return (
    <FormSheetModalLayout>
      <ButtonLarge
        analyticsActionName="MANAGE_SUBSCRIPTION"
        rounded={false}
        onPress={manageSubscription}
      >
        Manage Subscriptions
      </ButtonLarge>
    </FormSheetModalLayout>
  );
};
