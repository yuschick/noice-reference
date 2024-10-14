import { CurrencyIcon, CommonUtils } from '@noice-com/common-ui';
import { StringUtils } from '@noice-com/utils';
import { useEffect, useRef, useState } from 'react';

import { CurrencyUpdate } from './types';
import styles from './UserWallet.module.css';

import { Button } from '@common/button';
import { Textarea, TextField } from '@common/input';
import { ContentModulePage } from '@common/page-components';
import { showSnackbar } from '@common/snackbar';
import { WalletWalletCurrency } from '@gen';

interface WalletCurrencyProps {
  currency: WalletWalletCurrency;
  addWalletCurrency: (props: CurrencyUpdate) => Promise<void>;
  subtractWalletCurrency: (props: CurrencyUpdate) => Promise<void>;
}

export function WalletCurrency({
  addWalletCurrency,
  currency,
  subtractWalletCurrency,
}: WalletCurrencyProps) {
  /* We want to disable the text field while the mutation and animation are running */
  const [hasRunningMutation, setHasRunningMutation] = useState<boolean>(false);
  const currencyInputRef = useRef<HTMLInputElement>(null);
  const currencyAmountRef = useRef<HTMLSpanElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);

  const [isButtonsDisabled, setIsButtonsDisabled] = useState(true);

  const { currencyId, currencyAmount } = currency;
  const formattedCurrencyName = StringUtils.normalizePropertyName(currencyId);
  const currencyIconType = CommonUtils.getWalletCurrencyId(currencyId);

  const resetToReadyState = () => {
    const amountEl = currencyAmountRef.current;

    if (!amountEl) {
      return;
    }

    amountEl.removeAttribute('data-currency-amount');
    setHasRunningMutation(false);
  };

  const triggerPostActionAmountEffect = (amount: number, prefix: '+' | '-') => {
    const amountWrapperEl = currencyAmountRef.current;

    if (!amountWrapperEl) {
      return;
    }

    amountWrapperEl.setAttribute('data-currency-amount', `${prefix}${amount}`);
  };

  const onChange = () => {
    if (!currencyInputRef.current?.value || !reasonRef.current?.value) {
      setIsButtonsDisabled(true);
      return;
    }

    setIsButtonsDisabled(false);
  };

  const handleClickAddCurrency = async () => {
    const inputElement = currencyInputRef.current;
    inputElement?.removeAttribute('data-currency-amount');

    if (!inputElement) {
      return;
    }

    const amount = Number(inputElement.value);

    if (!amount || amount === 0) {
      return;
    }

    if (amount < 0) {
      showSnackbar('error', 'Please only enter positive amounts');
      return;
    }

    const reason = reasonRef.current?.value;

    if (!reason) {
      showSnackbar('error', 'Please enter a reason');
      return;
    }

    reasonRef.current.value = '';
    inputElement.value = '';
    setHasRunningMutation(true);
    await addWalletCurrency({ currency, amount, reason });

    triggerPostActionAmountEffect(amount, '+');
  };

  const handleClickSubtractCurrency = async () => {
    const inputElement = currencyInputRef.current;
    inputElement?.removeAttribute('data-currency-amount');

    if (!inputElement) {
      return;
    }

    const amount = Number(inputElement.value);

    if (!amount || amount === 0) {
      return;
    }

    if (amount < 0) {
      showSnackbar('error', 'Please only enter positive amounts');
      return;
    }

    const reason = reasonRef.current?.value;

    if (!reason) {
      showSnackbar('error', 'Please enter a reason');
      return;
    }

    inputElement.value = '';
    reasonRef.current.value = '';
    setHasRunningMutation(true);
    await subtractWalletCurrency({ currency, amount, reason });

    triggerPostActionAmountEffect(amount, '-');
  };

  useEffect(() => {
    const amountEl = currencyAmountRef.current;

    if (!amountEl) {
      return;
    }

    amountEl.addEventListener('animationend', resetToReadyState);

    return () => {
      amountEl.removeEventListener('animationend', resetToReadyState);
    };
  });

  if (!currencyIconType) {
    return null;
  }

  return (
    <ContentModulePage.Content title={formattedCurrencyName}>
      <div className={styles.currencyAmountWrapper}>
        <CurrencyIcon type={currencyIconType} />
        <span
          className={styles.currencyAmount}
          ref={currencyAmountRef}
        >
          {currencyAmount}
        </span>
      </div>
      <div className={styles.currencyInputWrapper}>
        <TextField
          disabled={hasRunningMutation}
          label={`${formattedCurrencyName} adjustment`}
          min={0}
          placeholder="Amount"
          ref={currencyInputRef}
          type="number"
          onChange={onChange}
        />

        <Textarea
          label="Reason"
          ref={reasonRef}
          onChange={onChange}
        />

        <div className={styles.buttonsWrapper}>
          <Button
            buttonType="success"
            disabled={isButtonsDisabled}
            text="Add"
            onClick={handleClickAddCurrency}
          />

          <Button
            buttonType="danger"
            disabled={isButtonsDisabled}
            text="Subtract"
            onClick={handleClickSubtractCurrency}
          />
        </div>
      </div>
    </ContentModulePage.Content>
  );
}
