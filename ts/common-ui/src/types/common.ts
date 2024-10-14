/**
 * Interface for a value range
 */
export interface Range {
  /**
   * Minimum value of the range
   */
  min: number;
  /**
   * Maximum value of the range
   */
  max: number;
}

/**
 * Interface for a one time timer
 */
export interface Timer {
  /**
   * Start timestamp of the timer
   */
  start: number;
  /**
   * End timestamp of the timer
   */
  end: number;
}

export interface CommonNoiceEnv {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CDN_URL: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  LOAD_START?: number;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  BUILD_HASH?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  BUILD_TIME?: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export type SliderDirection = 'next' | 'prev';

export const fontSizeOptions = ['small', 'medium', 'large'] as const;
export type FontSize = (typeof fontSizeOptions)[number];
