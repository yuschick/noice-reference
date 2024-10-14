import ftueConfig from '@noice-com/ftue-config';
import { DateAndTimeUtils, MarkupUtils } from '@noice-com/utils';

import { FtueConfigItem, ShouldShowFunc } from './types';

function getFunc(criteria?: string): ShouldShowFunc {
  return new Function(
    'playerStats',
    'uiContext',
    'flags',
    `return (${criteria || 'true'});`,
  ) as ShouldShowFunc;
}

const config = ftueConfig.map<FtueConfigItem>((cfgItem) => ({
  ...cfgItem,
  delayedShow: cfgItem.delayedShow
    ? DateAndTimeUtils.parseDuration(cfgItem.delayedShow)
    : undefined,
  shouldShow: cfgItem?.isEnabled ? getFunc(cfgItem.criteria) : () => false,
  body: cfgItem.body ? MarkupUtils.paragrapher(cfgItem.body) : undefined,
  hasDismissed: cfgItem.hasDismissed
    ? cfgItem.hasDismissed.split(',').map((id) => id.trim())
    : undefined,
}));

export default config;
