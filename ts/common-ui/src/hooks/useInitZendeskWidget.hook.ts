import { gql } from '@apollo/client';
import { useMountEffect } from '@noice-com/common-react-core';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { useEffect } from 'react';

import { useAuthentication } from '@common-context';
import { ZendeskPrefillProfileFragment } from '@common-gen';
import { ZendeskWidgetAPI } from '@common-types';

const { logError } = makeLoggers('ZENDESK');

gql`
  fragment ZendeskPrefillProfile on ProfileProfile {
    userId
    userTag
    account {
      email
    }
  }
`;

interface Props {
  profile: Nullable<ZendeskPrefillProfileFragment>;
  zE?: ZendeskWidgetAPI;
}

export function useInitZendeskWidget({ profile, zE }: Props): void {
  const { isImplicitAccount } = useAuthentication();

  useEffect(() => {
    if (!profile) {
      return;
    }

    try {
      zE?.('webWidget', 'prefill', {
        // @ts-expect-error
        name: {
          value: profile.userTag,
          readOnly: isImplicitAccount,
        },
        email: {
          value: profile.account?.email,
          readOnly: !!profile.account?.email,
        },
      });
    } catch (err) {
      logError('failed to prefill zendesk widget', err);
    }
  }, [isImplicitAccount, profile, zE]);

  useMountEffect(() => {
    try {
      zE?.('webWidget', 'updateSettings', {
        // @ts-expect-error
        offset: {
          horizontal: '72px',
        },
      });

      // @ts-expect-error
      zE?.('webWidget', 'setLocale', 'en-US');
    } catch (err) {
      logError('failed to init zendesk widget', err);
    }
  });
}
