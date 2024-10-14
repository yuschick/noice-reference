import { useAuthenticatedUser, useLegacyBooleanFeatureFlag } from '@noice-com/common-ui';

import { RenderQualityProfiles } from '../constants';
import { Link } from '../Link/Link';
import { StreamSettingsPageProps } from '../types';
import { qualityLayerEquals } from '../utils';

import { useStreamSettings } from '@stream-context';

export function RootPage({ onSelectPage }: StreamSettingsPageProps) {
  const [detailedRenderSettingsEnabledFlag] = useLegacyBooleanFeatureFlag(
    'detailedRenderSettings',
    false,
  );
  const [performanceProfilesEnabledFlag] = useLegacyBooleanFeatureFlag(
    'performanceProfiles',
    false,
  );
  const { hasRole } = useAuthenticatedUser();
  const { metricsVisible, streamQualities, streamQuality, performanceProfileIndex } =
    useStreamSettings();

  return (
    <>
      {hasRole('admin') && (
        <Link
          label="Render Metrics"
          value={metricsVisible ? 'Visible' : 'Hidden'}
          onClick={() => onSelectPage('render-metrics')}
        />
      )}
      {streamQualities && (
        <Link
          label="Stream quality"
          value={
            streamQualities.find((quality) => qualityLayerEquals(quality, streamQuality))
              ?.displayName ?? ''
          }
          onClick={() => onSelectPage('stream-quality')}
        />
      )}
      {performanceProfilesEnabledFlag && (
        <Link
          label="Render quality"
          value={RenderQualityProfiles[performanceProfileIndex]?.name ?? 'Custom'}
          onClick={() => onSelectPage('render-quality-profile')}
        />
      )}
      {detailedRenderSettingsEnabledFlag && (
        <Link
          label="Render settings"
          value=""
          onClick={() => onSelectPage('render-settings')}
        />
      )}
    </>
  );
}
