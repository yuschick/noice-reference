import { useLegacyBooleanFeatureFlag } from '@noice-com/common-ui';

import {
  CUSTOM_RENDER_QUALITY_PROFILE_INDEX,
  RenderQualityProfiles,
} from '../../constants';
import { RadioInput } from '../../RadioInput/RadioInput';

import { useStreamSettings } from '@stream-context';

export function RenderQuality() {
  const [detailedRenderSettingsEnabledFlag] = useLegacyBooleanFeatureFlag(
    'detailedRenderSettings',
    false,
  );
  const { performanceProfileIndex, setPerformanceProfileIndex } = useStreamSettings();

  return (
    <>
      {RenderQualityProfiles.map((profile, index) => (
        <RadioInput
          checked={performanceProfileIndex === index}
          key={`renderQualityProfileRadioButton_${index}`}
          label={profile.name}
          name="render-quality-profile"
          value={index.toString()}
          onChange={() => setPerformanceProfileIndex(index)}
        />
      ))}
      {detailedRenderSettingsEnabledFlag && (
        <RadioInput
          checked={performanceProfileIndex === CUSTOM_RENDER_QUALITY_PROFILE_INDEX}
          label="Custom"
          name="render-quality-profile"
          value={CUSTOM_RENDER_QUALITY_PROFILE_INDEX.toString()}
          onChange={() => setPerformanceProfileIndex(CUSTOM_RENDER_QUALITY_PROFILE_INDEX)}
        />
      )}
    </>
  );
}
