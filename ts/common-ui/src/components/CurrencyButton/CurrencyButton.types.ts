import { ButtonHTMLAttributes } from 'react';

import { PaymentCurrency } from '@common-gen';
import { WalletCurrencyId } from '@common-types';

export const buttonThemes = ['dark', 'light'] as const;
export const buttonLevels = ['primary', 'secondary'] as const;
export const buttonSizes = ['xs', 'sm', 'md', 'lg'] as const;

type CurrencyFreeButtonCurrency = {
  type: 'free';
};

type CurrencyButtonInGameCurrency = {
  type: 'in-game';
  value: number;
  currency: WalletCurrencyId;
};

type CurrencyButtonRealCurrency = {
  type: 'hard';
  value: number;
  currency: PaymentCurrency;
};

export type Props = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'color' | 'disabled' | 'style'
> & {
  cannotAfford?: boolean | { displayErrorAsTooltip?: boolean };
  theme?: (typeof buttonThemes)[number];
  level?: (typeof buttonLevels)[number];
  isDisabled?: boolean;
  isLoading?: boolean;
  size?: (typeof buttonSizes)[number];
  currency:
    | CurrencyButtonInGameCurrency
    | CurrencyButtonRealCurrency
    | CurrencyFreeButtonCurrency;
};
