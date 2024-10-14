import { RadioInput } from '../../../RadioInput/RadioInput';
import { shadowQualities } from '../constants';

import { useStreamSettings } from '@stream-context';

export function ShadowQuality() {
  const { performanceProfile, updatePerformanceProfile } = useStreamSettings();
  const { shadowQuality } = performanceProfile;

  return (
    <>
      {shadowQualities.map((shadow, index) => (
        <RadioInput
          checked={shadowQuality === shadow.value}
          key={`shadowQualityRadioInput_${index}`}
          label={shadow.label}
          name="render-settings-shadow-quality"
          value={shadow.value.toString()}
          onChange={() => updatePerformanceProfile({ shadowQuality: shadow.value })}
        />
      ))}
    </>
  );
}
