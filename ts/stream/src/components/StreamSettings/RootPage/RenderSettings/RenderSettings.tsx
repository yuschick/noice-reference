import { Link } from '../../Link/Link';
import { StreamSettingsPageProps } from '../../types';

import {
  antiAliasingTypes,
  crowdAnimationRates,
  crowdDetails,
  crowdModes,
  crowdResolutions,
  frameRates,
  lightingTypes,
  shadowTypes,
  shadowQualities,
} from './constants';

import { useStreamSettings } from '@stream-context';

export function RenderSettings({ onSelectPage }: StreamSettingsPageProps) {
  const { performanceProfile } = useStreamSettings();
  const {
    frameRate,
    crowdAnimationRate,
    crowdDetail,
    crowdResolution,
    crowdMode,
    shadowType,
    shadowQuality,
    lightingType,
    antiAliasing,
  } = performanceProfile;

  return (
    <>
      <Link
        label="Frame rate"
        value={frameRates.find((rate) => rate.value === frameRate)?.label ?? ''}
        onClick={() => onSelectPage('render-settings-frame-rate')}
      />
      <Link
        label="Crowd animation rate"
        value={
          crowdAnimationRates.find((rate) => rate.value === crowdAnimationRate)?.label ??
          ''
        }
        onClick={() => onSelectPage('render-settings-crowd-animation-rate')}
      />
      <Link
        label="Crowd detail"
        value={crowdDetails.find((detail) => detail.value === crowdDetail)?.label ?? ''}
        onClick={() => onSelectPage('render-settings-crowd-detail')}
      />
      <Link
        label="Crowd resolution"
        value={
          crowdResolutions.find((resolution) => resolution.value === crowdResolution)
            ?.label ?? ''
        }
        onClick={() => onSelectPage('render-settings-crowd-resolution')}
      />
      <Link
        label="Crowd mode"
        value={crowdModes.find((mode) => mode.value === crowdMode)?.label ?? ''}
        onClick={() => onSelectPage('render-settings-crowd-mode')}
      />
      <Link
        label="Shadows"
        value={shadowTypes.find((type) => type.value === shadowType)?.label ?? ''}
        onClick={() => onSelectPage('render-settings-shadow-type')}
      />
      <Link
        label="Shadow quality"
        value={
          shadowQualities.find((quality) => quality.value === shadowQuality)?.label ?? ''
        }
        onClick={() => onSelectPage('render-settings-shadow-quality')}
      />
      <Link
        label="Lighting"
        value={lightingTypes.find((type) => type.value === lightingType)?.label ?? ''}
        onClick={() => onSelectPage('render-settings-lighting-type')}
      />
      <Link
        label="Anti-aliasing"
        value={antiAliasingTypes.find((type) => type.value === antiAliasing)?.label ?? ''}
        onClick={() => onSelectPage('render-settings-anti-aliasing')}
      />
    </>
  );
}
