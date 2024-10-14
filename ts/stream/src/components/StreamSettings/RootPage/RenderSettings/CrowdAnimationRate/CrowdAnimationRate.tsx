import { RadioInput } from '../../../RadioInput/RadioInput';
import { crowdAnimationRates } from '../constants';

import { useStreamSettings } from '@stream-context';

export function CrowdAnimationRate() {
  const { performanceProfile, updatePerformanceProfile } = useStreamSettings();
  const { crowdAnimationRate } = performanceProfile;

  return (
    <>
      {crowdAnimationRates.map((rate, index) => (
        <RadioInput
          checked={crowdAnimationRate === rate.value}
          key={`crowdAnimationRateRadioInput_${index}`}
          label={rate.label}
          name="render-settings-crowd-animation-rate"
          value={rate.value.toString()}
          onChange={() => updatePerformanceProfile({ crowdAnimationRate: rate.value })}
        />
      ))}
    </>
  );
}
