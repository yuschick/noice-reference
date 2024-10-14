import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { useSocialPackageInternal } from '@social-context';
import { GiftParams, GiftTarget } from '@social-types';

interface HookResult {
  showGiftButton: boolean;
  onGiftButtonClick(): void;
}

type Props =
  | {
      target: GiftTarget.User;
      userId: string;
      channelId: Nullable<string>;
    }
  | {
      target: GiftTarget.Community;
      channelId: Nullable<string>;
    };

const isGiftParams = (params: Props): params is GiftParams => {
  return !!params.target && !!params.channelId;
};

export function useGiveGiftButton(props: Props): HookResult {
  const { giftButtonModel } = useSocialPackageInternal();

  const [showGiftButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!giftButtonModel) {
      return;
    }

    if (isGiftParams(props)) {
      const getShouldButtonToBeRendered = async () => {
        const showButton = await giftButtonModel.shouldButtonBeRendered(props);
        setShowButton(showButton);
      };

      getShouldButtonToBeRendered();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.channelId]);

  const onGiftButtonClick = () => {
    if (!giftButtonModel) {
      return;
    }

    if (isGiftParams(props)) {
      giftButtonModel.onClick(props);
    }
  };

  return {
    showGiftButton,
    onGiftButtonClick,
  };
}
