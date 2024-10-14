import { RadioInput } from '../../../RadioInput/RadioInput';
import { lightingTypes } from '../constants';

import { useStreamSettings } from '@stream-context';

export function LightingType() {
  const { performanceProfile, updatePerformanceProfile } = useStreamSettings();
  const { lightingType } = performanceProfile;

  return (
    <>
      {lightingTypes.map((type, index) => (
        <RadioInput
          checked={lightingType === type.value}
          key={`lightingTypeRadioInput_${index}`}
          label={type.label}
          name="render-settings-lighting-type"
          value={type.value.toString()}
          onChange={() => updatePerformanceProfile({ lightingType: type.value })}
        />
      ))}
    </>
  );
}
