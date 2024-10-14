import { RadioInput } from '../../../RadioInput/RadioInput';
import { shadowTypes } from '../constants';

import { useStreamSettings } from '@stream-context';

export function Shadows() {
  const { performanceProfile, updatePerformanceProfile } = useStreamSettings();
  const { shadowType } = performanceProfile;

  return (
    <>
      {shadowTypes.map((shadow, index) => (
        <RadioInput
          checked={shadowType === shadow.value}
          key={`shadowTypeRadioInput_${index}`}
          label={shadow.label}
          name="render-settings-shadow-type"
          value={shadow.value.toString()}
          onChange={() => updatePerformanceProfile({ shadowType: shadow.value })}
        />
      ))}
    </>
  );
}
