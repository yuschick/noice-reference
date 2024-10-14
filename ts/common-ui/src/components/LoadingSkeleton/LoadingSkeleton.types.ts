import { HTMLAttributes } from 'react';

// Only support the gap & direction props when count is provided
type PropsWithCount = {
  /**
   * Provide the number of skeleton items to render
   */
  count: number;
  /**
   * Define in which direction the skeleton items should be rendered
   */
  direction?: 'column' | 'row';
  /**
   * Define the gap between each skeleton item
   */
  gap?: number;
};

type PropsWithoutCount = {
  count?: never;
  direction?: never;
  gap?: never;
};

interface BaseProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  height?: number;
  width?: number;
}

export type Props = BaseProps & (PropsWithCount | PropsWithoutCount);
