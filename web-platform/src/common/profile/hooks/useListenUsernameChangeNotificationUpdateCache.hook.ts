import { gql, useApolloClient } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { Violation } from '@noice-com/schemas/moderation/platform_moderation.pb';
import { DeepPartial } from '@noice-com/utils';
import { useEffect } from 'react';

import { ModerationViolation, ProfileProfile } from '@gen';

const reasonMap: Record<Violation, ModerationViolation> = {
  [Violation.VIOLATION_UNSPECIFIED]: ModerationViolation.ViolationUnspecified,
  [Violation.VIOLATION_SPAM]: ModerationViolation.ViolationSpam,
  [Violation.VIOLATION_CHILD_SAFETY]: ModerationViolation.ViolationChildSafety,
  [Violation.VIOLATION_VIOLENCE]: ModerationViolation.ViolationViolence,
  [Violation.VIOLATION_HATEFUL_BEHAVIOR]: ModerationViolation.ViolationHatefulBehavior,
  [Violation.VIOLATION_HARASSMENT_TARGETED_ABUSE]:
    ModerationViolation.ViolationHarassmentTargetedAbuse,
  [Violation.VIOLATION_ILLEGAL_HARMFUL_AND_RESTRICTED_ACTIVITY]:
    ModerationViolation.ViolationIllegalHarmfulAndRestrictedActivity,
  [Violation.VIOLATION_SEXUAL_BEHAVIOR]: ModerationViolation.ViolationSexualBehavior,
  [Violation.VIOLATION_SELF_HARM]: ModerationViolation.ViolationSelfHarm,
  [Violation.VIOLATION_GRAPHIC_REAL_WORLD_MEDIA]:
    ModerationViolation.ViolationGraphicRealWorldMedia,
  [Violation.VIOLATION_OFF_PLATFORM_BEHAVIOR]:
    ModerationViolation.ViolationOffPlatformBehavior,
  [Violation.VIOLATION_RESTRICTED_GAMES_AND_GAMES_WITH_GRAPHIC_FOOTAGE]:
    ModerationViolation.ViolationRestrictedGamesAndGamesWithGraphicFootage,
  [Violation.VIOLATION_RESPONSIBLE_STREAMING]:
    ModerationViolation.ViolationResponsibleStreaming,
  [Violation.VIOLATION_CIRCUMVENTION_EVASION]:
    ModerationViolation.ViolationCircumventionEvasion,
  [Violation.VIOLATION_PLATFORM_MANIPULATION]:
    ModerationViolation.ViolationPlatformManipulation,
  [Violation.VIOLATION_REPEATED_COPYRIGHT_INFRINGEMENT]:
    ModerationViolation.ViolationRepeatedCopyrightInfringement,
  [Violation.VIOLATION_EXTREMISM]: ModerationViolation.ViolationExtremism,
  [Violation.VIOLATION_OTHER]: ModerationViolation.ViolationOther,
};

export function useListenUsernameChangeNotificationUpdateCache() {
  const client = useClient();
  const { cache } = useApolloClient();
  const { userId } = useAuthenticatedUser();

  useEffect(() => {
    return client.NotificationService.notifications({
      onUsernameChange(_ctx, ev) {
        cache.updateFragment<DeepPartial<ProfileProfile>>(
          {
            id: cache.identify({
              userId,
              __typename: 'ProfileProfile',
            }),
            fragment: gql`
              fragment UpdateProfileOnUsernameChangeNotification on ProfileProfile {
                userTag
                canChangeUsernameAt
                usernameHistory(limit: 1) {
                  reason
                }
              }
            `,
          },
          (existingProfile) => {
            if (!ev.reason) {
              return existingProfile;
            }

            const reason = reasonMap[ev.reason];

            return {
              ...existingProfile,
              userTag: ev.newUsername,
              canChangeUsernameAt:
                reason === ModerationViolation.ViolationUnspecified
                  ? existingProfile?.canChangeUsernameAt
                  : ev.changedAt,
              usernameHistory: [
                {
                  ...existingProfile?.usernameHistory?.[0],
                  reason: reason,
                },
              ],
            };
          },
        );
      },
    });
  }, [cache, client.NotificationService, userId]);
}
