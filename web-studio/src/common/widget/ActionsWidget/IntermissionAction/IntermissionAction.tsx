import { gql } from '@apollo/client';
import { useMountEffect } from '@noice-com/common-react-core';
import {
  SetTimeoutId,
  useAnalytics,
  useLegacyBooleanFeatureFlag,
} from '@noice-com/common-ui';
import {
  AnalyticsEventStudioWidgetActionsAction,
  AnalyticsEventStudioWidgetActionsOrigin,
} from '@noice-com/schemas/analytics/analytics.pb';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { ActionButton } from '../ActionButton/ActionButton';

import { useChannelContext } from '@common/channel';
import { useCameraDriveState } from '@common/stream';
import {
  RenderingCameraTransitionRequestTransitionTarget,
  useTriggerCameraTransitionMutation,
} from '@gen';

gql`
  mutation TriggerCameraTransition(
    $streamId: ID!
    $cameraTransitionTarget: RenderingCameraTransitionRequestTransitionTarget!
  ) {
    streamerTriggerCameraTransition(
      streamId: $streamId
      cameraTransitionTarget: $cameraTransitionTarget
    ) {
      success
    }
  }
`;

interface Props {
  streamId: string;
}

const COOLDOWN = 3 * 1000;

export function IntermissionAction({ streamId }: Props) {
  const { channelId } = useChannelContext();
  const [isCoolingDown, setIsCoolingDown] = useState(false);

  const cooldownTimeout = useRef<SetTimeoutId>();

  const { trackEvent } = useAnalytics();
  const [cameraTransitionsEnabled] = useLegacyBooleanFeatureFlag(
    'studioCameraTransitions',
    false,
  );
  const { enabled: cameraDrivesEnabled, active: isCameraDrive } = useCameraDriveState();

  const [triggerCameraTransition] = useTriggerCameraTransitionMutation({
    onCompleted() {
      setIsCoolingDown(true);
      cooldownTimeout.current = setTimeout(() => setIsCoolingDown(false), COOLDOWN);
    },
    onError(error) {
      toast.error('Could not execute action: ' + error.message);
    },
  });

  const handleClick = () => {
    trackEvent({
      clientStudioWidgetActions: {
        action: isCameraDrive
          ? AnalyticsEventStudioWidgetActionsAction.ACTION_END_INTERMISSION
          : AnalyticsEventStudioWidgetActionsAction.ACTION_START_INTERMISSION,
        channelId,
        origin: window.externalStudioWidget
          ? AnalyticsEventStudioWidgetActionsOrigin.ORIGIN_EXTERNAL
          : AnalyticsEventStudioWidgetActionsOrigin.ORIGIN_STUDIO,
      },
    });

    if (isCameraDrive) {
      triggerCameraTransition({
        variables: {
          streamId,
          cameraTransitionTarget:
            RenderingCameraTransitionRequestTransitionTarget.TransitionTargetArena,
        },
      });

      return;
    }

    triggerCameraTransition({
      variables: {
        streamId,
        cameraTransitionTarget:
          RenderingCameraTransitionRequestTransitionTarget.TransitionTargetCameraDrive1,
      },
    });
  };

  useMountEffect(() => {
    return () => {
      if (cooldownTimeout.current) {
        clearTimeout(cooldownTimeout.current);
      }
    };
  });

  if (!cameraTransitionsEnabled) {
    return null;
  }

  return (
    <ActionButton
      color="magenta"
      disabled={!streamId || isCoolingDown || !cameraDrivesEnabled}
      onClick={handleClick}
    >
      {isCameraDrive ? 'Stop intermission' : 'Start intermission'}
    </ActionButton>
  );
}
