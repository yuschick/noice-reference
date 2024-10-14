import { CoreAssets } from '@noice-com/assets-core';
import {
  Button,
  CurrencyButton,
  IconButton,
  WalletCurrencyId,
  useAuthenticatedUser,
} from '@noice-com/common-ui';

import styles from './ActionButtons.module.css';

type CostDetails = {
  currency: string;
  amount: number;
};

interface Props {
  isAvatarChanged: boolean;
  cost?: CostDetails;

  onDiscardChanges(): void;
  onSaveAndClose(): void;
  onPurchase(): void;
  onClose(): void;
}

export function ActionButtons({
  isAvatarChanged,
  cost,
  onDiscardChanges,
  onSaveAndClose,
  onPurchase,
  onClose,
}: Props) {
  const { isImplicitAccount } = useAuthenticatedUser();

  return (
    <div className={styles.wrapper}>
      {isAvatarChanged && (
        <>
          <IconButton
            icon={CoreAssets.Icons.Refresh}
            label="Discard changes"
            level="secondary"
            shape="circle"
            size="sm"
            onClick={onDiscardChanges}
          />
          {cost ? (
            <CurrencyButton
              currency={{
                type: 'in-game',
                currency: cost.currency as WalletCurrencyId,
                value: cost.amount,
              }}
              isDisabled={false} // TODO check wallet
              size={'sm'}
              onClick={onPurchase}
            >
              Purchase & Save
            </CurrencyButton>
          ) : (
            <Button
              iconEnd={CoreAssets.Icons.ArrowRight}
              shape="pill"
              size="sm"
              onClick={onSaveAndClose}
            >
              Save
            </Button>
          )}
        </>
      )}

      {(isImplicitAccount || !isAvatarChanged) && (
        <IconButton
          icon={CoreAssets.Icons.Close}
          label="Discard changes"
          shape="circle"
          size="sm"
          onClick={onClose}
        />
      )}
    </div>
  );
}
