import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import ftueConfig from '@noice-com/ftue-config';
import { useCallback } from 'react';
import { BiReset, BiSync } from 'react-icons/bi';

import styles from './FTUE.module.css';
import { FTUEDrawer } from './FTUEDrawer/FTUEDrawer';

import { QueryTableModulePage } from '@common/page-components';
import {
  FtueDismissTooltipsQuery,
  FtueDismissTooltipsQueryVariables,
  useFtueDeleteDismissTooltipMutation,
  useFtueDismissTooltipMutation,
  useFtueDismissTooltipsQuery,
} from '@gen';

const filteredConfigs = ftueConfig.filter((config) => !!config.isEnabled);

gql`
  query FTUEDismissTooltips($userId: ID!) {
    dismissedTooltips(userId: $userId) {
      tooltipIds
    }
  }
`;

gql`
  mutation FTUEDismissTooltip($tooltipId: ID!, $type: FtueDismissalType!) {
    dismissTooltip(tooltipId: $tooltipId, dismissalType: $type) {
      emptyTypeWorkaround
    }
  }
`;

gql`
  mutation FTUEDeleteDismissTooltip($tooltipId: ID!) {
    deleteDismissedTooltip(tooltipId: $tooltipId) {
      emptyTypeWorkaround
    }
  }
`;

export function FTUE() {
  const { userId } = useAuthenticatedUser();
  const queryResult = useFtueDismissTooltipsQuery({ variables: { userId } });

  const [deleteDismissTooltip] = useFtueDeleteDismissTooltipMutation();
  const [dismissTooltip] = useFtueDismissTooltipMutation();

  const onResetClick = useCallback(async () => {
    await Promise.all(
      queryResult.data?.dismissedTooltips?.tooltipIds.map((tooltipId) =>
        deleteDismissTooltip({
          variables: { tooltipId },
        }),
      ) ?? [],
    );

    await queryResult.refetch();
  }, [deleteDismissTooltip, queryResult]);

  const onRefetchClick = useCallback(() => {
    queryResult.refetch();
  }, [queryResult]);

  const dataTransform = (data: FtueDismissTooltipsQuery) => {
    return filteredConfigs.map((config) => ({
      priority: `#${config.priority}`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      dismissed: !!data?.dismissedTooltips?.tooltipIds.includes(config.id!),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: config.id!,
      anchorElement: config.uiElementAnchor,
      action: config.action ?? '–',
      criteria: config.criteria ? (
        <span className={styles.criteriaCode}>{config.criteria}</span>
      ) : (
        '–'
      ),
      dismissedBefore: config.hasDismissed ?? '–',
      delay: config.delayedShow ?? '–',
    }));
  };

  return (
    <QueryTableModulePage<FtueDismissTooltipsQuery, FtueDismissTooltipsQueryVariables>
      actions={[
        {
          text: 'Reset dismisses',
          onClick: onResetClick,
          icon: BiReset,
          type: 'button',
        },
        {
          text: 'Refetch',
          onClick: onRefetchClick,
          icon: BiSync,
          type: 'button',
        },
      ]}
      caption="First time user experience (FTUE) events"
      dataTransform={dataTransform}
      drawer={{
        title: 'FTUE config',
        content: (
          <FTUEDrawer
            dismissedTooltips={queryResult.data?.dismissedTooltips?.tooltipIds || []}
            onToggleFinished={queryResult.refetch}
            onToggleOff={deleteDismissTooltip}
            onToggleOn={dismissTooltip}
          />
        ),
      }}
      idField="id"
      queryResult={queryResult}
      includeIdField
      openDrawerOnRowClick
    />
  );
}
