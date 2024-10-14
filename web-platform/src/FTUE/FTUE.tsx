import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useAuthentication } from '@noice-com/common-ui';

import styles from './FTUE.module.css';
import { FTUEComponent } from './FTUEComponent/FTUEComponent';
import { useCurrentFTUEComponent } from './hooks/useCurrentFTUEComponent.hook';
import { useFTUEDisabled } from './hooks/useFTUEDisabled.hook';

import { useFtueDismissComponentsQuery } from '@gen';

gql`
  query FTUEDismissComponents($userId: ID!) {
    dismissedTooltips(userId: $userId) {
      tooltipIds
    }
  }
`;

export function FTUE() {
  const { userId } = useAuthentication();

  const { data } = useFtueDismissComponentsQuery({
    ...variablesOrSkip({ userId }),
  });

  const dismissedTooltips = data?.dismissedTooltips?.tooltipIds ?? [];

  const currentComponent = useCurrentFTUEComponent({ dismissedTooltips });
  const ftueDisabled = useFTUEDisabled();

  if (!currentComponent || ftueDisabled) {
    return null;
  }

  return (
    <div
      className={styles.wrapper}
      data-ftue
    >
      <FTUEComponent
        key={currentComponent.id}
        {...currentComponent}
      />
    </div>
  );
}
