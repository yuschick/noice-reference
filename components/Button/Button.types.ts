import { ButtonHTMLAttributes } from 'react';

import { SvgComponent } from '@common-types';

export const buttonColors = ['dark', 'light'] as const;
export const buttonLevels = ['primary', 'secondary'] as const;
export const buttonShapes = ['circle', 'pill', 'rounded', 'sharp'] as const;
export const buttonSizes = ['xs', 'sm', 'md', 'lg'] as const;
export const buttonVariants = ['cta', 'ghost', 'solid'] as const;

type ButtonNonSolidProps = {
  level?: never;
  theme?: never;
  variant?: 'cta';
};

type ButtonSolidProps = {
  /** @default 'primary' */
  level?: (typeof buttonLevels)[number];
  /** @default 'light' */
  theme?: (typeof buttonColors)[number];
  /** @default 'solid' */
  variant?: 'ghost' | 'solid';
};

export type ButtonFitProps = {
  /** @default 'container' */
  fit?: 'container' | 'content';
};

export type ButtonBaseProps = {
  isDisabled?: boolean;
  isLoading?: boolean;
  /** @default 'pill */
  shape?: (typeof buttonShapes)[number];
  /** @default 'md' */
  size?: (typeof buttonSizes)[number];
} & (ButtonNonSolidProps | ButtonSolidProps);

export type ButtonIconPositions = {
  iconEnd?: SvgComponent;
  iconStart?: SvgComponent;
};

export type HTMLButtonAttributes = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'disabled' | 'style'
>;

export type Props = HTMLButtonAttributes &
  ButtonBaseProps &
  ButtonIconPositions &
  ButtonFitProps;
