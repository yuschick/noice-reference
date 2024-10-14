import { gql } from '@apollo/client';
import { useAnalytics, useAuthenticatedUser, WithChildren } from '@noice-com/common-ui';
import { AnalyticsEventStudioWidgetStudioWidgetEvent } from '@noice-com/schemas/analytics/analytics.pb';
import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { MosaicBranch, MosaicWindow } from 'react-mosaic-component';

import { useExternalPopoutUrl } from './hooks/useExternalPopoutUrl.hook';
import { WidgetMenu } from './WidgetMenu/WidgetMenu';

import { useChannelContext } from '@common/channel';
import { useWidgetLayout, useWidgetMenu, WidgetId } from '@common/widget';
import { useWidgetWrapperUserQuery } from '@gen';

const widgetTitleById: Record<WidgetId, string> = {
  [WidgetId.Actions]: 'Actions',
  [WidgetId.ActivityFeed]: 'Activity Feed',
  [WidgetId.AutoMod]: 'AutoMod queue',
  [WidgetId.Challenges]: 'Challenges',
  [WidgetId.Chat]: 'Chat',
  [WidgetId.ChatUserList]: 'User List',
  [WidgetId.GameCrowd]: 'Game & Crowd',
  [WidgetId.Leaderboard]: 'Leaderboard',
  [WidgetId.ModeratorLog]: 'Moderator Log',
  [WidgetId.TopPredictions]: 'Top Predictions',
  [WidgetId.StreamHighlights]: 'Activity Feed',
  [WidgetId.AudienceInsights]: 'Audience Insights',
};

const WIN_PARAMS = 'width=640, height=480, left=300, top=200, resizable';

gql`
  query WidgetWrapperUser($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...ExternalPopoutProfile
    }
  }
`;

interface Props {
  widgetId: WidgetId;
  path: MosaicBranch[];
}

export function WidgetMosaicWrapper({ children, path, widgetId }: WithChildren<Props>) {
  const { userId } = useAuthenticatedUser();
  const { removeWidget } = useWidgetLayout();
  const { controls, menuOptions, filters, settings } = useWidgetMenu();
  const { channelId } = useChannelContext();
  const { trackEvent } = useAnalytics();

  const { data } = useWidgetWrapperUserQuery({
    variables: {
      userId,
    },
  });

  const availableUrl = useExternalPopoutUrl({ widgetId, profile: data?.profile ?? null });

  const handlePopout = useCallback(() => {
    window.open(availableUrl, widgetId, WIN_PARAMS);

    // Send init event to analytics
    trackEvent({
      studioWidgets: {
        event: AnalyticsEventStudioWidgetStudioWidgetEvent.STUDIO_WIDGET_EVENT_POPOUT,
        channelId,
        userId,
        widgets: [
          {
            widgetName: widgetId,
          },
        ],
      },
    });
  }, [availableUrl, channelId, trackEvent, userId, widgetId]);

  const handleExternalPopout = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(availableUrl.toString());
      toast.success('External link copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy external link to clipboard');
    }
  }, [availableUrl]);

  const handleRemove = useCallback(() => {
    removeWidget(widgetId);
  }, [removeWidget, widgetId]);

  const defaultControl = useMemo(
    () => (
      <WidgetMenu
        key={widgetId}
        options={menuOptions}
        onPopOut={handlePopout}
        onRemove={handleRemove}
        onShowPopOutUrl={handleExternalPopout}
      />
    ),
    [handleExternalPopout, handlePopout, handleRemove, menuOptions, widgetId],
  );

  return (
    <MosaicWindow<WidgetId>
      path={path}
      title={widgetTitleById[widgetId]}
      toolbarControls={[controls, filters, settings, defaultControl]}
    >
      {children}
    </MosaicWindow>
  );
}
