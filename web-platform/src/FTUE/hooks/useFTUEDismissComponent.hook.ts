import { gql } from '@apollo/client';
import { makeLoggers } from '@noice-com/utils';
import { useCallback } from 'react';

import { FtueDismissalType, useFtueDismissComponentMutation } from '@gen';

const { logError } = makeLoggers('FTUE dismiss');

interface HookResult {
  setFTUEDismissed(tooltipId: string, type: FtueDismissalType): void;
}

gql`
  mutation FTUEDismissComponent($tooltipId: ID!, $type: FtueDismissalType) {
    dismissTooltip(tooltipId: $tooltipId, dismissalType: $type) {
      emptyTypeWorkaround
    }
  }
`;

export function useFTUEDismissComponent(): HookResult {
  const [dismissComponent] = useFtueDismissComponentMutation({
    // Update cache directly when mutation is done
    update(cache, _result, { variables }) {
      cache.modify({
        fields: {
          dismissedTooltips(
            existingDismissedTooltips: { tooltipIds: string[] } = { tooltipIds: [] },
          ) {
            return {
              tooltipIds: [...existingDismissedTooltips.tooltipIds, variables?.tooltipId],
            };
          },
        },
      });
    },
    onError(error) {
      logError(error);
    },
  });

  const setFTUEDismissed = useCallback(
    (componentId: string, type: FtueDismissalType) => {
      dismissComponent({
        variables: {
          tooltipId: componentId,
          type,
        },
      });
    },
    [dismissComponent],
  );

  return {
    setFTUEDismissed,
  };
}
