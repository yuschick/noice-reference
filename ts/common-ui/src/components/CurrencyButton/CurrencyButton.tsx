import { CoreAssets } from '@noice-com/assets-core';
import classNames from 'classnames';
import { forwardRef, useId, useRef } from 'react';

import { CurrencyIcon } from '../CurrencyIcon';
import { Icon } from '../Icon';
import { LoadingSpinner } from '../LoadingSpinner';
import { TooltipPortal } from '../TooltipPortal';

import styles from './CurrencyButton.module.css';
import { Props } from './CurrencyButton.types';

import {
  useMergeRefs,
  useMouseClickWithSound,
  useMouseEnterWithSound,
} from '@common-hooks';
import { WalletCurrencyId, WithChildren } from '@common-types';
import { getFormattedPriceWithCurrency, getWalletCurrencyIdName } from '@common-utils';

export const CurrencyButton = forwardRef<HTMLButtonElement, WithChildren<Props>>(
  function CurrencyButton(
    {
      cannotAfford,
      children,
      currency,
      isDisabled,
      isLoading,
      level = 'primary',
      onClick,
      onMouseEnter,
      size = 'md',
      theme = 'light',
      ...htmlAttributes
    },
    externalRef,
  ) {
    const internalRef = useRef<HTMLButtonElement>(null);
    const ref = useMergeRefs([internalRef, externalRef]);
    const cannotAffordId = useId();
    const cannotAffordTooltipId = useId();

    /*
    The native HTML 'disabled' attribute is one of the rare cases where it does more harm than good.
    When using 'disabled' the element is not clickable, but it's also not focusable or readable by assistive technologies.
    Instead, we use aria-disabled and prevent click/press events manually.
    This way, disabled buttons can still be understood by assistive technologies.
    */
    function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      if (isDisabled || isLoading) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event);
    }

    const handleMouseEnterWithSound = useMouseEnterWithSound(onMouseEnter);
    const handleClickWithSound = useMouseClickWithSound(handleClick);

    const cannotAffordPurchase =
      cannotAfford && typeof cannotAfford === 'object'
        ? cannotAfford.displayErrorAsTooltip
        : cannotAfford;

    return (
      <div className={styles.currencyButtonWrapper}>
        <button
          {...((isDisabled || cannotAffordPurchase) && { 'aria-disabled': true })}
          {...(isLoading && { 'aria-busy': true })}
          {...(cannotAffordPurchase && { 'aria-describedby': cannotAffordId })}
          className={classNames(
            styles.currencyButton,
            styles[size],
            styles[level],
            styles[theme],
          )}
          ref={ref}
          type="button"
          {...(!isDisabled && !isLoading && { onMouseEnter: handleMouseEnterWithSound })}
          onClick={handleClickWithSound}
          {...htmlAttributes}
        >
          <div className={styles.buttonContent}>
            {isLoading && !isDisabled && (
              <div className={styles.buttonLoadingWrapper}>
                <LoadingSpinner size="sm" />
              </div>
            )}
            <div className={styles.buttonChildContentWrapper}>{children}</div>
          </div>

          <div className={styles.currencyContent}>
            {currency.type === 'in-game' && (
              <CurrencyIcon
                className={styles.currencyIcon}
                type={currency.currency}
              />
            )}

            {currency.type === 'free' && 'Free'}

            {currency.type === 'in-game' && currency.value}

            {currency.type === 'hard' &&
              getFormattedPriceWithCurrency({
                currency: currency.currency,
                price: currency.value,
              })}
          </div>
        </button>

        {currency.type !== 'free' && cannotAffordPurchase && (
          <>
            {typeof cannotAfford === 'boolean' && (
              <div
                className={styles.cannotAffordError}
                id={cannotAffordId}
              >
                <Icon
                  color="text-dark"
                  icon={CoreAssets.Icons.Exclamation}
                  size={24}
                />
                <span>
                  You don`t have enough{' '}
                  {getWalletCurrencyIdName(
                    currency.type === 'hard'
                      ? WalletCurrencyId.HardCurrency
                      : currency.currency,
                    true,
                  ).toLowerCase()}{' '}
                  to complete this purchase.
                </span>
              </div>
            )}

            {typeof cannotAfford === 'object' && cannotAfford?.displayErrorAsTooltip && (
              <div id={cannotAffordTooltipId}>
                <TooltipPortal
                  anchorRef={internalRef}
                  delay={500}
                  placement="top-end"
                  portalElementId={cannotAffordTooltipId}
                >
                  You don`t have enough{' '}
                  {getWalletCurrencyIdName(
                    currency.type === 'hard'
                      ? WalletCurrencyId.HardCurrency
                      : currency.currency,
                    true,
                  ).toLowerCase()}{' '}
                  to complete this purchase.
                </TooltipPortal>
              </div>
            )}
          </>
        )}
      </div>
    );
  },
);
