import { RadioInput } from '../../../RadioInput/RadioInput';
import { crowdModes } from '../constants';

import { useStreamSettings } from '@stream-context';

export function CrowdMode() {
  const { performanceProfile, updatePerformanceProfile } = useStreamSettings();
  const { crowdMode } = performanceProfile;

  return (
    <>
      {crowdModes.map((mode, index) => (
        <RadioInput
          checked={crowdMode === mode.value}
          key={`crowdModeRadioInput_${index}`}
          label={mode.label}
          name="render-settings-crowd-mode"
          value={mode.value.toString()}
          onChange={() => updatePerformanceProfile({ crowdMode: mode.value })}
        />
      ))}
    </>
  );
}
