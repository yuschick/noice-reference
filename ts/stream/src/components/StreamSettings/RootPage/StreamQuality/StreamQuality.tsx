import { RadioInput } from '../../RadioInput/RadioInput';
import { qualityLayerEquals } from '../../utils';

import { useStreamSettings } from '@stream-context';

export function StreamQuality() {
  const { streamQualities, streamQuality, setStreamQuality } = useStreamSettings();

  return (
    <>
      {streamQualities
        .concat()
        .sort((a, b) => (b.height ?? 0) - (a.height ?? 0))
        .map((quality, index) => (
          <RadioInput
            checked={qualityLayerEquals(streamQuality, quality)}
            key={`streamQualityRadioInput_${index}`}
            label={quality.displayName ?? ''}
            name="stream-quality"
            value={quality.displayName ?? ''}
            onChange={() => setStreamQuality(quality)}
          />
        ))}
    </>
  );
}
