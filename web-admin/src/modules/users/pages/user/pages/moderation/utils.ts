import { CommonUtils } from '@noice-com/common-ui';

import { InputOption } from '@common/input/types';
import { ModerationViolation } from '@gen';

export const violationOptions: InputOption[] = Object.values(ModerationViolation)
  .filter(
    (val) =>
      ![
        ModerationViolation.ViolationSpam,
        ModerationViolation.ViolationUnspecified,
      ].includes(val),
  )
  .map((violation) => ({
    label: CommonUtils.getPlatformViolationText(violation),
    value: violation,
  }));
