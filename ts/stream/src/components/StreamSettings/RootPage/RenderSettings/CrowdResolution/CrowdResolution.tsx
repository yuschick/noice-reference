import { RadioInput } from '../../../RadioInput/RadioInput';
import { crowdResolutions } from '../constants';

import { useStreamSettings } from '@stream-context';

export function CrowdResolution() {
  const { performanceProfile, updatePerformanceProfile } = useStreamSettings();
  const { crowdResolution } = performanceProfile;

  return (
    <>
      {crowdResolutions.map((resolution, index) => (
        <RadioInput
          checked={crowdResolution === resolution.value}
          key={`crowdResolutionRadioInput_${index}`}
          label={resolution.label}
          name="render-settings-crowd-resolution"
          value={resolution.value.toString()}
          onChange={() => updatePerformanceProfile({ crowdResolution: resolution.value })}
        />
      ))}
    </>
  );
}
