import { DateAndTimeUtils } from '@noice-com/utils';
import { useCallback, useMemo, useState } from 'react';

import { DebugMenuItem } from '../types';

interface HookResult {
  showBuild: boolean;
  buildInfos: DebugMenuItem[];
  buildInfoString: string;
  toggleShowBuild(): void;
}

export function useDebugMenuBuildInfo(): HookResult {
  const [showBuild, setShowBuild] = useState(true);

  const toggleShowBuild = useCallback(() => {
    setShowBuild((prev) => !prev);
  }, []);

  const buildInfos = useMemo(() => {
    return [
      {
        label: 'Build time',
        value: DateAndTimeUtils.ShortDates.format(NOICE.BUILD_TIME),
      },
      {
        label: 'Build hash',
        value: NOICE.BUILD_HASH.slice(0, 7),
      },
    ];
  }, []);

  const buildInfoString = useMemo(() => {
    let buildInfoString = 'Build info\n';

    buildInfos.forEach((info) => {
      buildInfoString += '- ' + info.label + ': ';
      buildInfoString += info.value + '\n';
    });

    return buildInfoString;
  }, [buildInfos]);

  return { buildInfos, buildInfoString, showBuild, toggleShowBuild };
}
