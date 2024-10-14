import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useAnalytics, useFeatureFlags } from '@noice-com/common-ui';
import { ConfigItemMessageType } from '@noice-com/schemas/ftue/ftue.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useMemo } from 'react';

import ftueConfig from '../config';
import { FTUEComponentProps } from '../FTUEComponent/FTUEComponent';

import { useFTUECriteriaData } from './useFTUECriteriaData.hook';
import { useFTUEDismissComponent } from './useFTUEDismissComponent.hook';
import { useVisibleFTUEAnchors } from './useVisibleFTUEAnchors.hook';

import { useStreamGame } from '@common/stream';
import { useFeatureFlag } from '@context';
import {
  FtueListDismissedTooltipsResponse,
  useFtueCurrentStreamChannelQuery,
} from '@gen';

gql`
  query FTUECurrentStreamChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
      game {
        id
        name
      }
    }
  }
`;

const featureFlagToKeyValue = (key: string, value: unknown) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {
      [key]: value,
    };
  }

  let keyValue = {};
  // If it's an object type feature flag, flatten it so that we can access values easier
  // e.g. cardGame_cardSelectImprovements: { autoOpenCardSelect: true }
  // ->  cardGame_cardSelectImprovements_autoOpenCardSelect: true
  for (const [nestedKey, nestedValue] of Object.entries(value)) {
    keyValue = {
      ...keyValue,
      [`${key}_${nestedKey}`]: nestedValue,
    };
  }

  return keyValue;
};

interface Props {
  dismissedTooltips: FtueListDismissedTooltipsResponse['tooltipIds'];
}

export function useCurrentFTUEComponent({
  dismissedTooltips,
}: Props): Nullable<FTUEComponentProps> {
  const { trackEvent } = useAnalytics();
  const [ignoreFTUEcriteria] = useFeatureFlag('ignoreFTUEcriteria');
  const [featureFlags] = useFeatureFlags();
  const { setFTUEDismissed } = useFTUEDismissComponent();
  const { channelId } = useStreamGame();

  const { data } = useFtueCurrentStreamChannelQuery({
    ...variablesOrSkip({ channelId }),
  });

  const parsedFeatureFlags = useMemo(() => {
    if (!featureFlags) {
      return null;
    }

    return Object.entries(featureFlags.values()).reduce((acc, [key, value]) => {
      let val;
      try {
        val = JSON.parse(value);
      } catch {
        val = value;
      }

      return { ...acc, ...featureFlagToKeyValue(key, val) };
    }, {});
  }, [featureFlags]);

  const channelName = data?.channel?.name;
  const gameName = data?.channel?.game?.name;

  const activeAnchors = useMemo(() => {
    // No active anchors when there is not yet data from dismissed components
    if (!dismissedTooltips) {
      return [];
    }

    return [
      // Unique values
      ...new Set(
        ftueConfig
          // Filter components that does not have anchor
          .filter((component) => !!component.uiElementAnchor)
          // Filter components that are dismissed
          .filter((component) => !dismissedTooltips.includes(component.id ?? 'fake-id'))
          // Get anchors
          .map((component) => component.uiElementAnchor)
          .filter(Boolean) as string[],
      ),
    ];
  }, [dismissedTooltips]);

  const convertVariableContent = useCallback(
    (content?: string) =>
      content
        ?.replace('{{channelName}}', channelName ?? '')
        .replace('{{gameName}}', gameName ?? ''),
    [channelName, gameName],
  );

  const ftueConfigWithVariableContent = useMemo(
    () =>
      ftueConfig.map((config) => ({
        ...config,
        title: convertVariableContent(config.title),
        body: convertVariableContent(config.body),
      })),
    [convertVariableContent],
  );

  const { visibleFTUEIds, anchorsById } = useVisibleFTUEAnchors(activeAnchors);
  const { uiContext, playerStats } = useFTUECriteriaData(!activeAnchors.length);

  const setFTUEDisplayed = useCallback(
    (ftueId: string, ftueMessageType: ConfigItemMessageType) => {
      trackEvent({
        clientFtueDisplayed: {
          ftueId,
          ftueMessageType,
        },
      });
    },
    [trackEvent],
  );

  const currentComponent = useMemo<Nullable<FTUEComponentProps>>(() => {
    // Don't show any component until we have the data
    if (!playerStats || !dismissedTooltips || !uiContext || !parsedFeatureFlags) {
      return null;
    }

    const filteredComponents = ftueConfigWithVariableContent
      // Filter out dismissed FTUE ids
      .filter((component) => !dismissedTooltips.includes(component.id ?? 'fake-id'))

      // Filter only visible FTUE ids
      .filter((component) =>
        visibleFTUEIds.includes(component.uiElementAnchor ?? 'fake-anchor'),
      )

      // Filter only those that can be shown by dismissed criteria, unless there is ignore flag
      .filter((component) => {
        if (ignoreFTUEcriteria) {
          return true;
        }

        if (!component.hasDismissed) {
          return true;
        }

        return component.hasDismissed.every((dismissId) =>
          dismissedTooltips.includes(dismissId),
        );
      })

      // Filter only those criteria field is true, unless there is ignore flag
      .filter((component) =>
        ignoreFTUEcriteria
          ? true
          : component.shouldShow(playerStats, uiContext, parsedFeatureFlags),
      );

    if (!filteredComponents.length) {
      return null;
    }

    const prioritizedComponents = filteredComponents.sort(
      (a, z) => (a.priority ?? 0) - (z.priority ?? 0),
    );

    const component = prioritizedComponents[0];

    // If anchor is missing, return null
    if (!component.uiElementAnchor || !anchorsById[component.uiElementAnchor]) {
      return null;
    }

    return {
      ...component,
      anchor: anchorsById[component.uiElementAnchor],
      setFTUEDismissed,
      setFTUEDisplayed,
    };
  }, [
    playerStats,
    dismissedTooltips,
    uiContext,
    parsedFeatureFlags,
    ftueConfigWithVariableContent,
    anchorsById,
    setFTUEDismissed,
    setFTUEDisplayed,
    visibleFTUEIds,
    ignoreFTUEcriteria,
  ]);

  return currentComponent;
}
