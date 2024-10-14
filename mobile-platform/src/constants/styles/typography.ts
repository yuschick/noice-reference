import * as BrandTokens from '@noice-com/design-tokens';

export const typography = {
  fontFamily: {
    mono: 'Roboto Mono',
    main: 'Rubik',
  },
  fontSize: BrandTokens.fontSize,
  lineHeight: {
    xxxs: 9,
    xxs: 12,
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 48,
    xxxxl: 64,
  },
  fontWeight: {
    // @todo font-weights are incorrect (numbers) in the common package atm
    ...BrandTokens.fontWeight,
    /* Deprecated */
    extraBold: '800',
    bold: '700',
    semiBold: '600',
    medium: '500',
    regular: '400',
  },
} as const;
