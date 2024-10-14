import {
  WithChildren,
  WalletCurrencyId,
  Dialog,
  useDialog,
  Button,
  CurrencyButton,
} from '@noice-com/common-ui';

import styles from './DailyGoalConfirmationDialog.module.css';

export type DialogProps = WithChildren<{
  title: string;
  warning?: string;
  currency?: {
    currencyId: WalletCurrencyId;
    currencyAmount: number;
  };
  canceled(): void;
  confirmed(): void;
}>;

export function DailyGoalConfirmationDialog({
  canceled,
  confirmed,
  title,
  warning,
  currency,
  children,
}: DialogProps) {
  const dialog = useDialog({ initialState: 'open', title, onClose: canceled });

  return (
    <Dialog store={dialog}>
      <Dialog.Header />
      <Dialog.Content>
        <div className={styles.contentContainer}>{children}</div>

        {!!warning && (
          <div className={styles.warningContainer}>
            <span className={styles.warningLabel}>{warning}</span>
          </div>
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          level="secondary"
          theme="dark"
          onClick={canceled}
        >
          No
        </Button>

        {currency && (
          <CurrencyButton
            currency={{
              type: 'in-game',
              currency: currency.currencyId,
              value: currency.currencyAmount,
            }}
            onClick={confirmed}
          >
            Yes
          </CurrencyButton>
        )}
      </Dialog.Actions>
    </Dialog>
  );
}
