import { CommonUserDataKeys } from '@noice-com/common-ui';
import { QualityLayer } from '@noice-com/schemas/stream/egress.pb';
import { Nullable } from '@noice-com/utils';

import { RenderQualityProfileSettings } from './stream-settings';

export interface StreamLocalStorageKeys extends CommonUserDataKeys {
  // Render settings
  'renderSettings.performanceProfileIndex': number;
  'renderSettings.performanceProfile': RenderQualityProfileSettings;
  'renderSettings.metricsVisible': boolean;
  // Stream settings
  'streamSettings.preferredQuality': Nullable<QualityLayer>;
}
