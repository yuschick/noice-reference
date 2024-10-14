import { CommonUtils, useMediaQuery } from '@noice-com/common-ui';

import { MatchGroupWaitingLg } from './MatchGroupWaitingLg';
import { MatchGroupWaitingSm } from './MatchGroupWaitingSm';
import { MatchGroupWaitingSmProps } from './types';

export function MatchGroupWaitingWrapper(props: MatchGroupWaitingSmProps) {
  const isSmallScreen = useMediaQuery(`(max-width: ${CommonUtils.getRem(459)})`);

  return isSmallScreen ? <MatchGroupWaitingSm {...props} /> : <MatchGroupWaitingLg />;
}
