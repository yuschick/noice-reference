import { gql } from '@apollo/client';

import { useSubscriptionPaymentMethodSessionMutation } from '@gen';

interface HookResult {
  showModal: () => void;
}

gql`
  mutation SubscriptionPaymentMethodSession {
    updateSubscriptionPaymentMethod {
      sessionData
    }
  }
`;

interface Props {
  onModalClose?(): void;
}

export function useSubscriptionPaymentMethodDialog({ onModalClose }: Props): HookResult {
  const [createSession] = useSubscriptionPaymentMethodSessionMutation();

  const showModal = () => {
    /* @ts-ignore-next-line */
    Chargebee.init({
      site: NOICE.CHARGEBEE_SITE,
    });
    /* @ts-ignore-next-line */
    const cbInstance = Chargebee.getInstance();

    cbInstance.openCheckout({
      hostedPage: async () => {
        const data = await createSession();

        const session = data?.data?.updateSubscriptionPaymentMethod?.sessionData || '';
        const decoded = window.atob(session);
        const parsed = JSON.parse(decoded);

        return parsed;
      },
      close: () => {
        onModalClose?.();
      },
    });
  };

  return {
    showModal,
  };
}
