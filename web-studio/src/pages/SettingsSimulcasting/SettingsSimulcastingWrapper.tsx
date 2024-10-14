import { useBooleanFeatureFlag } from '@noice-com/common-ui';

import { SettingsRestreaming } from './legacy/SettingsRestreaming/SettingsRestreaming';
import { SettingsSimulcasting } from './SettingsSimulcasting';

export function SettingsSimulcastingWrapper() {
  const [newSimulcastingUIEnabled] = useBooleanFeatureFlag(
    'simulcasting_newSettingsUI',
    false,
  );

  if (!newSimulcastingUIEnabled) {
    return <SettingsRestreaming />;
  }

  return <SettingsSimulcasting />;
}
