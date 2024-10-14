import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useState } from 'react';
import { useParams } from 'react-router';

import { PlatformSuspensionAppealForm } from '../../../../common';

import { ChannelBans } from './ChannelBans/ChannelBans';
import { ModerationEvents } from './ModerationEvents/ModerationEvents';
import { PlatformSuspensionModerationModal } from './PlatformSuspensionModerationModal/PlatformSuspensionModerationModal';
import { SuspensionStatus } from './SuspensionStatus';
import { UsernameRejection } from './UsernameRejection/UsernameRejection';

import { ModalDialog } from '@common/dialog';
import { ContentModulePage } from '@common/page-components';
import { PermissionWrapper } from '@common/permission';
import {
  AuthPlatformRole,
  useModerationUnsuspendPlatformUserMutation,
  useUserModerationQuery,
} from '@gen';

gql`
  query UserModeration($userId: ID!) {
    platformBan(userId: $userId) {
      banId
      violation
      description
      bannedAt
      ...SuspensionStatusPlatformSuspension
      ...PlatformSuspensionAppealFormSuspension
    }

    profile(userId: $userId) {
      userId
      ...PlatformSuspensionModerationModalProfile
      ...PlatformSuspensionAppealFormProfile
      ...UsernameRejectionProfile
      moderationEvents: usernameHistory {
        ...ModerationEventsProfileUsernameChange
      }
    }

    userChannelBans(userId: $userId, cursor: { first: 5 }) {
      bans {
        userId
        channelId
        ...ModerationChannelBan
      }
    }
  }
`;

gql`
  mutation ModerationUnsuspendPlatformUser($userId: ID!) {
    unbanPlatformUser(userId: $userId) {
      emptyTypeWorkaround
    }
  }
`;

export function Moderation() {
  const { userId } = useParams();

  const [showPlatformSuspensionModal, setShowPlatformSuspensionModal] = useState(false);
  const [showAppealReviewModal, setShowAppealReviewModal] = useState(false);

  const { data, error, loading, refetch } = useUserModerationQuery({
    ...variablesOrSkip({ userId }),
  });

  const [unsuspendUser] = useModerationUnsuspendPlatformUserMutation({
    onCompleted() {
      onSubmit();
    },
  });

  if (loading) {
    return <ContentModulePage.Loading />;
  }

  if (error || !data?.profile || !userId) {
    return <ContentModulePage.Error />;
  }

  const onSubmit = () => {
    setShowPlatformSuspensionModal(false);
    setShowAppealReviewModal(false);
    refetch();
  };

  return (
    <ContentModulePage>
      <PermissionWrapper allowedRoles={[AuthPlatformRole.PlatformRoleModerator]}>
        <SuspensionStatus
          platformSuspension={data.platformBan ?? null}
          onReviewAppealClick={() => setShowAppealReviewModal(true)}
          onSuspendButtonClick={() => setShowPlatformSuspensionModal(true)}
          onUnsuspendButtonClick={() => unsuspendUser({ variables: { userId } })}
        />

        <ChannelBans channelBans={data.userChannelBans?.bans ?? []} />

        <UsernameRejection profile={data.profile} />

        <PlatformSuspensionModerationModal
          open={showPlatformSuspensionModal}
          profile={data.profile}
          onClose={() => {
            setShowPlatformSuspensionModal(false);
          }}
          onSubmit={onSubmit}
        />

        {!!data.platformBan && (
          <ModalDialog
            isOpen={showAppealReviewModal}
            title="Platform Suspension Appeal"
            onClose={() => {
              setShowAppealReviewModal(false);
            }}
          >
            <PlatformSuspensionAppealForm
              platformSuspension={data.platformBan}
              profile={data.profile}
              onSubmit={onSubmit}
            />
          </ModalDialog>
        )}
      </PermissionWrapper>

      <ModerationEvents moderationEvents={data.profile.moderationEvents ?? []} />
    </ContentModulePage>
  );
}
