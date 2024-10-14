import { gql } from '@apollo/client';
import { useConditionalOnce } from '@noice-com/common-react-core';
import {
  Button,
  NoiceLogo,
  Icon,
  useUpdateAvatar,
  useAuthenticatedUser,
  LoadingSpinner,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { Suspense, lazy, useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaInfoCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router';

import styles from './AvatarSelector.module.css';
import { Grid } from './Grid/Grid';
import { useAvatarSelectorAnalytics } from './hooks/useAvatarSelectorAnalytics.hook';
import { useAvatarSelectorAvatars } from './hooks/useAvatarSelectorAvatars.hook';

import { Routes } from '@common/route';
import { UseAvatarSelectorAvatarFragment, useAvatarSetupProfileQuery } from '@gen';

const AvatarViewerUrl = lazy(() =>
  import('../../../common/avatar/AvatarViewerUrl/AvatarViewerUrl').then((module) => ({
    default: module.AvatarViewerUrl,
  })),
);

gql`
  query AvatarSetupProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      avatars {
        avatar2D
      }
    }
  }
`;

export function AvatarSelector() {
  const { userId } = useAuthenticatedUser();
  const { avatars, loading } = useAvatarSelectorAvatars();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAvatarId, setSelectedAvatarId] = useState<Nullable<string>>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { sendSelectAvatarEvent, sendViewAvatarEvent } = useAvatarSelectorAnalytics();

  useAvatarSetupProfileQuery({
    variables: {
      userId,
    },
    onCompleted(data) {
      if (data.profile?.avatars) {
        navigate(location.state?.from ?? Routes.Home, { replace: true });
      }
    },
  });

  useConditionalOnce(() => {
    if (!avatars?.length || loading) {
      return;
    }

    setSelectedAvatarId(avatars[0].id);
  }, !!avatars && !loading);

  const [changeAvatarId] = useUpdateAvatar();

  const handleContinueButtonClickFunc = useCallback(
    async (avatar: UseAvatarSelectorAvatarFragment) => {
      setSubmitting(true);
      await changeAvatarId({
        variables: {
          avatarId: avatar.id,
        },
        errorPolicy: 'all',
      });
      setSubmitting(false);
      sendSelectAvatarEvent(avatar.id);

      if (location.state?.from) {
        navigate(location.state?.from);
      } else {
        navigate(Routes.Home);
      }
    },
    [changeAvatarId, navigate, location.state?.from, sendSelectAvatarEvent],
  );

  const handleSelectAvatarFunc = useCallback(
    (id: string) => {
      setSelectedAvatarId(id);
      sendViewAvatarEvent(id);
    },
    [sendViewAvatarEvent],
  );

  const selectedAvatar = avatars.find((avatar) => avatar.id === selectedAvatarId);

  return (
    <div className={styles.avatarSelectorContent}>
      <Helmet>
        <title>Select avatar</title>
      </Helmet>

      <div className={styles.wrapper}>
        <div className={styles.leftWrapper}>
          <div className={styles.header}>
            <NoiceLogo
              className={styles.noiceLogo}
              theme="spectrum"
              variant="mark"
            />
            <h1 className={styles.headerText}>Choose avatar</h1>
          </div>
          <div className={styles.leftColumn}>
            <Grid
              avatars={avatars}
              selectedAvatarId={selectedAvatarId}
              onSelectAvatar={handleSelectAvatarFunc}
            />
          </div>
        </div>
        <div className={styles.rightColumn}>
          {selectedAvatar && (
            <Suspense fallback={<LoadingSpinner />}>
              <AvatarViewerUrl url={selectedAvatar.avatar3D} />
            </Suspense>
          )}
          <div className={styles.customiseInfo}>
            <Icon
              className={styles.infoIcon}
              icon={FaInfoCircle}
              size={24}
            />
            <span className={styles.customiseInfoText}>
              You can change and customise your avatar later with avatar editor
            </span>
          </div>
        </div>
        {selectedAvatar && (
          <div className={styles.continueButtonWrapper}>
            <Button
              data-testid="avatar-selector-continue-button"
              isLoading={submitting}
              variant="solid"
              onClick={() => handleContinueButtonClickFunc(selectedAvatar)}
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
