import { RadioInput } from '../../../RadioInput/RadioInput';
import { frameRates } from '../constants';

import { useStreamSettings } from '@stream-context';

export function FrameRate() {
  const { performanceProfile, updatePerformanceProfile } = useStreamSettings();
  const { frameRate } = performanceProfile;

  return (
    <>
      {frameRates.map((rate, index) => (
        <RadioInput
          checked={frameRate === rate.value}
          key={`frameRateRadioInput_${index}`}
          label={rate.label}
          name="render-settings-frame-rate"
          value={rate.value.toString()}
          onChange={() => updatePerformanceProfile({ frameRate: rate.value })}
        />
      ))}
    </>
  );
}
