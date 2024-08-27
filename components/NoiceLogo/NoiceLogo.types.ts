import { ImgHTMLAttributes } from 'react';

export type NoiceLogoVariant = 'horizontal' | 'mark' | 'type' | 'vertical';
export type NoiceLogoTheme =
  | 'black'
  | 'black-flat'
  | 'dark'
  | 'light'
  | 'light-flat'
  | 'spectrum';

export type NoiceLogoBase = {
  theme: Extract<NoiceLogoTheme, 'dark' | 'light'>;
  variant: Extract<NoiceLogoVariant, 'horizontal' | 'type' | 'vertical'>;
};

export type NoiceLogoMark = {
  theme: Extract<
    NoiceLogoTheme,
    'black' | 'black-flat' | 'light' | 'light-flat' | 'spectrum'
  >;
  variant: Extract<NoiceLogoVariant, 'mark'>;
};

export type Props = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'alt' | 'onError' | 'onLoad' | 'src' | 'style'
> &
  (NoiceLogoBase | NoiceLogoMark);
