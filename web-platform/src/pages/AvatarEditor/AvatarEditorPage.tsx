import { gql } from '@apollo/client';
import { useMountEffect } from '@noice-com/common-react-core';
import { LoadingSpinner, useAnalytics, useAuthenticatedUser } from '@noice-com/common-ui';
import {
  AnalyticsEventClientSignupStepSignupMode,
  AnalyticsEventClientSignupStepSignupStep,
} from '@noice-com/schemas/analytics/analytics.pb';
import { AvatarPart } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';
import { Suspense, lazy, useCallback, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router';

import { AvatarCustomisations, useAvatarSave } from '@common/avatar';
import { useAvatarEditorProfileQuery } from '@gen';

const AvatarEditor = lazy(() =>
  import('@common/avatar/AvatarEditor/AvatarEditor').then((module) => ({
    default: module.AvatarEditor,
  })),
);

gql`
  query AvatarEditorProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      avatarConfig {
        modelId
      }
    }
  }
`;

export function AvatarEditorPage() {
  const [editorSessionId, setEditorSessionId] = useState<string>('unknown');
  const { trackEvent } = useAnalytics();
  const { actions: avatarSaveActions } = useAvatarSave();
  const { userId } = useAuthenticatedUser();

  const { data, loading: profileLoading } = useAvatarEditorProfileQuery({
    variables: {
      userId,
    },
    fetchPolicy: 'cache-and-network',
  });

  const location = useLocation();
  const orgLocationKey = useRef<string>(location.key);

  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    trackEvent({
      clientAvatarEditorClosed: { avatarEditorSessionId: editorSessionId },
    });

    // If avatar editor page is included to signup steps, we need to track it
    if (location.state?.includeToSignupSteps) {
      trackEvent({
        clientSignupStep: {
          step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_AVATAR_EDITOR_COMPLETED,
          mode: AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_SIGNUP,
        },
      });
    }

    if (location.state?.from) {
      navigate(location.state?.from, {
        state: { ...location.state, includeToSignupSteps: true, from: undefined },
      });

      if (location.state?.includeToSignupSteps) {
        trackEvent({
          clientSignupStep: {
            step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_COMPLETED,
            mode: AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_SIGNUP,
          },
        });
      }
      return;
    }

    if (orgLocationKey.current === 'default') {
      navigate('/');
    } else {
      navigate(-1);
    }
  }, [navigate, trackEvent, location, editorSessionId]);

  const handleSaveAndClose = useCallback(
    async (
      avatarComposition: Map<string, AvatarPart>,
      customisations: Nullable<AvatarCustomisations>,
    ) => {
      avatarSaveActions.saveAvatar(editorSessionId, {
        avatarComposition,
        customisations,
      });

      handleClose();
    },
    [avatarSaveActions, editorSessionId, handleClose],
  );

  useMountEffect(() => {
    const timestamp = new Date().getTime().toString();
    const analyticsSessionId = `${userId}_${timestamp}`;
    setEditorSessionId(analyticsSessionId);

    trackEvent({
      clientAvatarEditorOpened: { avatarEditorSessionId: analyticsSessionId },
    });

    // If avatar editor page is included to signup steps, we need to track it
    if (location.state?.includeToSignupSteps) {
      trackEvent({
        clientSignupStep: {
          step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_AVATAR_EDITOR_ENTER,
          mode: AnalyticsEventClientSignupStepSignupMode.SIGNUP_MODE_SIGNUP,
        },
      });
    }
  });

  return (
    <>
      <Helmet>
        <title>Edit avatar</title>
      </Helmet>
      {!profileLoading && (
        <Suspense fallback={<LoadingSpinner />}>
          <AvatarEditor
            avatarId={data?.profile?.avatarConfig?.modelId}
            editorSessionId={editorSessionId}
            onClose={handleClose}
            onSaveAndClose={handleSaveAndClose}
          />
        </Suspense>
      )}
    </>
  );
}
