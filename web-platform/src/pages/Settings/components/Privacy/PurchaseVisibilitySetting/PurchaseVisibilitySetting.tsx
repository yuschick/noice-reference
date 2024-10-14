import { gql } from '@apollo/client';
import { Switch, useAuthenticatedUser } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import { SettingsGroup, SettingsItem } from '../../SettingsGroup';

import {
  ProfileProfile,
  PurchaseVisibilitySettingProfileFragment,
  useProfilePrivacyHidePurchaseVisibilityMutation,
} from '@gen';

gql`
  fragment PurchaseVisibilitySettingProfile on ProfileProfile {
    settings {
      privacy {
        anonymisePurchaseHighlights
      }
    }
  }

  mutation ProfilePrivacyHidePurchaseVisibility(
    $userId: ID
    $anonymisePurchaseHighlights: Boolean
  ) {
    updatePrivacySettings(
      userId: $userId
      body: { anonymisePurchaseHighlights: $anonymisePurchaseHighlights }
    ) {
      anonymisePurchaseHighlights
    }
  }
`;

interface Props {
  profile: PurchaseVisibilitySettingProfileFragment;
}

export function PurchaseVisibilitySetting({ profile }: Props) {
  const { userId } = useAuthenticatedUser();

  const anonymisePurchaseHighlights =
    !!profile?.settings?.privacy.anonymisePurchaseHighlights;

  const [togglePurchasePrivacy, { loading }] =
    useProfilePrivacyHidePurchaseVisibilityMutation({
      update(cache, _result, { variables }) {
        cache.updateFragment<DeepPartial<ProfileProfile>>(
          {
            id: cache.identify({ userId, __typename: 'ProfileProfile' }),
            fragment: gql`
              fragment OnlinePurchasePrivacyUpdateProfile on ProfileProfile {
                userId
                settings {
                  privacy {
                    anonymisePurchaseHighlights
                  }
                }
              }
            `,
          },
          (existingProfile) => ({
            ...existingProfile,
            settings: {
              ...existingProfile?.settings,
              privacy: {
                ...existingProfile?.settings?.privacy,
                anonymisePurchaseHighlights:
                  variables?.anonymisePurchaseHighlights ?? undefined,
              },
            },
          }),
        );
      },
    });

  const onPurchasePrivacyChange = () => {
    togglePurchasePrivacy({
      variables: {
        userId,
        anonymisePurchaseHighlights: !anonymisePurchaseHighlights,
      },
    });
  };

  return (
    <SettingsGroup
      description="Control how your platform and channel purchases will be shown on Noice"
      title="Purchase visibility"
    >
      <SettingsItem
        description="Your username will be shown in the chat and to the creator when subscribing or making a purchase on a channel store."
        state={!anonymisePurchaseHighlights ? 'enabled' : 'disabled'}
      >
        <span>Show purchase highlights on chat</span>
        <SettingsItem.Control>
          <Switch
            checked={!anonymisePurchaseHighlights}
            isLoading={loading}
            label="Show purchase highlights on chat"
            labelType="hidden"
            onChange={onPurchasePrivacyChange}
          />
        </SettingsItem.Control>
      </SettingsItem>
    </SettingsGroup>
  );
}
