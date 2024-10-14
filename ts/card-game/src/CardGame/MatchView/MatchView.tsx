import { CommonUtils, useMediaQuery } from '@noice-com/common-ui';

import { MatchViewLg } from './MatchViewLg';
import { MatchViewSm } from './MatchViewSm';
import { MatchViewProps } from './types';

export function MatchView(props: MatchViewProps) {
  const isSmallScreen = useMediaQuery(`(max-width: ${CommonUtils.getRem(459)})`);

  return isSmallScreen ? <MatchViewSm {...props} /> : <MatchViewLg {...props} />;
}
