import { RadioInput } from '../../../RadioInput/RadioInput';
import { crowdDetails } from '../constants';

import { useStreamSettings } from '@stream-context';

export function CrowdDetail() {
  const { performanceProfile, updatePerformanceProfile } = useStreamSettings();
  const { crowdDetail } = performanceProfile;

  return (
    <>
      {crowdDetails.map((detail, index) => (
        <RadioInput
          checked={crowdDetail === detail.value}
          key={`crowdDetailRadioInput_${index}`}
          label={detail.label}
          name="render-settings-crowd-detail"
          value={detail.value.toString()}
          onChange={() => updatePerformanceProfile({ crowdDetail: detail.value })}
        />
      ))}
    </>
  );
}
