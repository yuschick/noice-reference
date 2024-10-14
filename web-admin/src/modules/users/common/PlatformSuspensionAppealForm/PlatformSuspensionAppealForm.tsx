import { ApolloCache, gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';

import styles from './PlatformSuspensionAppealForm.module.css';

import { Button } from '@common/button';
import {
  ModerationAppealStatus,
  PlatformSuspensionAppealFormSuspensionFragment,
  PlatformSuspensionAppealFormProfileFragment,
  useUpdateSuspensionAppealMutation,
} from '@gen';

gql`
  mutation UpdateSuspensionAppeal($banId: ID!, $status: ModerationAppealStatus!) {
    updatePlatformBanAppeal(banId: $banId, status: $status) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  platformSuspension: PlatformSuspensionAppealFormSuspensionFragment;
  profile: PlatformSuspensionAppealFormProfileFragment;
  onSubmit?(): void;
}

const removeBanIdFromPlatformSuspensionAppealsCache = (
  cache: ApolloCache<unknown>,
  banId: string,
) => {
  const banCacheId = cache.identify({
    banId: banId,
    __typename: 'ModerationPlatformBanAppeal',
  });

  if (!banCacheId) {
    return;
  }

  cache.evict({ id: banCacheId });
  cache.gc();
};

export function PlatformSuspensionAppealForm({
  onSubmit,
  platformSuspension,
  profile,
}: Props) {
  const { banId, violation, description, appeal } = platformSuspension;

  const [updateAppeal] = useUpdateSuspensionAppealMutation({
    update(cache) {
      removeBanIdFromPlatformSuspensionAppealsCache(cache, banId);
    },
    onCompleted() {
      onSubmit?.();
    },
  });

  const handleAccept = () => {
    const status = ModerationAppealStatus.AppealStatusAccepted;
    updateAppeal({ variables: { banId, status } });
  };

  const handleReject = () => {
    const status = ModerationAppealStatus.AppealStatusDeclined;
    updateAppeal({ variables: { banId, status } });
  };

  const createdAt = profile.account?.createdAt
    ? DateAndTimeUtils.getShortDate(profile.account.createdAt)
    : '?';

  return (
    <div className={styles.wrapper}>
      <div className={styles.profile}>
        <ProfileImage profile={profile} />

        <div className={styles.userData}>
          <span className={styles.userTag}>{profile.userTag}</span>
          <span className={styles.label}>Account created</span>
          <time
            className={styles.createdAt}
            dateTime={createdAt}
          >
            {createdAt}
          </time>
        </div>
      </div>

      <div>
        <h3 className={styles.title}>Suspension reason</h3>
        <span className={styles.reason}>{violation}</span>
      </div>

      <div>
        <h3 className={styles.title}>Moderator note</h3>
        <p className={styles.description}>{description}</p>
      </div>

      <hr className={styles.separator} />

      <div>
        <h3 className={styles.title}>Appeal</h3>
        <p className={styles.description}>{appeal?.appealText}</p>
      </div>

      <div className={styles.actions}>
        <Button
          buttonType="success"
          text="Accept appeal"
          onClick={handleAccept}
        />
        <Button
          buttonType="danger"
          color="red"
          text="Reject appeal"
          onClick={handleReject}
        />
      </div>
    </div>
  );
}

PlatformSuspensionAppealForm.fragments = {
  suspension: gql`
    fragment PlatformSuspensionAppealFormSuspension on ModerationPlatformBan {
      banId
      appeal {
        appealText
        banId
      }
      description
      violation
    }
  `,
  profile: gql`
    fragment PlatformSuspensionAppealFormProfile on ProfileProfile {
      userId
      userTag
      account {
        createdAt
      }
      ...ProfileImageProfile
    }
  `,
};
