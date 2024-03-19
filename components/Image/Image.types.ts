import { ImgHTMLAttributes, SourceHTMLAttributes } from 'react';

export const imageFit = [
  'contain',
  'cover',
  'fill',
  'inherit',
  'initial',
  'none',
  'revert',
  'scale-down',
] as const;
export const imagePriority = ['auto', 'high', 'low'] as const;
export const imageQuality = ['low', 'medium', 'high'] as const;
export const imageLoadingType = ['none', 'shine'] as const;

export interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'style'> {
  /**
   * A fallback image to use if the main image fails to load.
   */
  fallbackSrc?: string;
  /**
   * Define how the image is resized to fit its container. This property maps to the CSS `object-fit` property.
   */
  fit?: (typeof imageFit)[number];
  /**
   * Define the style of loading, either a silent loading or an animated shine.
   */
  loadingType?: (typeof imageLoadingType)[number];
  /**
   * Where `fetchPriority` is supported, tell the browser how the image loading should be prioritized.
   */
  priority?: (typeof imagePriority)[number];

  /**
   * An array of image sources to be used for responsive image sizes and formats.
   */
  sources?: SourceHTMLAttributes<HTMLSourceElement>[];
  /**
   * The quality to pass to the CDN to optimize the image. This is only used if the `src` is available on the CDN.
   */
  quality?: (typeof imageQuality)[number];
  /**
   * Control how long we wait for a `src` before showing the failure state.
   */
  waitForSrc?: number;
  /**
   * A callback function to run if the image fails to load.
   */
  onError?: () => void;
  /**
   * A callback function to run if the image successfully loads.
   */
  onLoad?: () => void;
}
