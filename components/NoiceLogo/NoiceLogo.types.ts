import { ImgHTMLAttributes } from 'react';

export type NoiceLogoVariant = 'horizontal' | 'mark' | 'type' | 'vertical';
export type NoiceLogoColor =
  | 'black'
  | 'black-flat'
  | 'dark'
  | 'light'
  | 'light-flat'
  | 'spectrum';

type NoiceLogoBase = {
  color: Extract<NoiceLogoColor, 'dark' | 'light'>;
  variant: Extract<NoiceLogoVariant, 'horizontal' | 'type' | 'vertical'>;
};

type NoiceLogoMark = {
  color: Extract<
    NoiceLogoColor,
    'black' | 'black-flat' | 'light' | 'light-flat' | 'spectrum'
  >;
  variant: Extract<NoiceLogoVariant, 'mark'>;
};

export type Props = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'alt' | 'onError' | 'onLoad' | 'src' | 'style'
> &
  (NoiceLogoBase | NoiceLogoMark);
