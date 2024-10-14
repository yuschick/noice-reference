import { RadioInput } from '../../../RadioInput/RadioInput';
import { antiAliasingTypes } from '../constants';

import { useStreamSettings } from '@stream-context';

export function AntiAliasing() {
  const { performanceProfile, updatePerformanceProfile } = useStreamSettings();
  const { antiAliasing } = performanceProfile;

  return (
    <>
      {antiAliasingTypes.map((type, index) => (
        <RadioInput
          checked={antiAliasing === type.value}
          key={`antiAliasingTypeRadioInput_${index}`}
          label={type.label}
          name="render-settings-anti-aliasing"
          value={type.value.toString()}
          onChange={() => updatePerformanceProfile({ antiAliasing: type.value })}
        />
      ))}
    </>
  );
}
