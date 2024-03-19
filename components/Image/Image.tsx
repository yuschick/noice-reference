import classNames from 'classnames';
import { CSSProperties, forwardRef, useEffect, useRef, useState } from 'react';

import NoiceLogo from '../NoiceLogo/assets/logo-noice-mark-light-flat.svg?url';

import styles from './Image.module.css';
import { Props } from './Image.types';

import { useMergeRefs } from '@common-hooks';

const supportedSizes = [50, 100, 250, 500, 750, 1000, 1280];
function generateSrcSet({ src, quality }: Pick<Props, 'src' | 'quality'>) {
  return supportedSizes
    .map((size) => {
      return `https://cf-cdn.noice.com/?image=${src}&width=${size}&quality=${quality} ${size}w`;
    })
    .join(', ');
}

export const Image = forwardRef<HTMLImageElement, Props>(function Image(
  {
    fallbackSrc,
    fit,
    loadingType = 'shine',
    // priority = 'auto',
    quality = 'high',
    waitForSrc = 3000,
    ...htmlAttributes
  },
  externalRef,
) {
  const { alt, className, height, onError, onLoad, srcSet, sizes, sources, src, width } =
    htmlAttributes;

  /**
   * Responsive Images Logic:
   * When requesting an image from GCP, we want to forward that request to Cloudflare to optimize the image.
   * However, we can only reliably do this if either of the following conditions are met:
   *
   * 1. The `size` attribute is set when using the <Image /> component.
   * or as a fallback:
   * 2. The `width` attribute is set to a non-percentage value when using the <Image /> component.
   * If the width is defined, we will try to use this to generate the `sizes` attribute.
   */

  // We want to exclude client-cdn images, they are images from our codebase
  const isExternalImage = src?.startsWith('https') && !src.includes('client-cdn');
  const fetchImageFromCDN =
    isExternalImage &&
    // We can only fetch responsive images if we have a sizes attributes or a non-percentage width
    (sizes || (width && !width.toString().includes('%')));
  const sizesFallback = width
    ? typeof width === 'number'
      ? `${width}px`
      : width
    : undefined;
  /** End Responsive Images Logic */

  const [imageState, setImageState] = useState<'error' | 'loading' | 'ready'>('loading');
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const internalRef = useRef<HTMLImageElement>(null);
  const ref = useMergeRefs([externalRef, internalRef]);

  const handleOnError = () => {
    onError?.();

    // Because the main src failed to load, we only want to use the
    // fallback if it's different to prevent an onError loop.
    const imageEl = internalRef.current;
    if (imageEl && fallbackSrc && fallbackSrc !== src && imageEl?.src !== fallbackSrc) {
      imageEl.src = fallbackSrc;
      return;
    }

    setImageState('error');
  };

  const handleOnLoad = () => {
    onLoad?.();
    setImageState('ready');
  };

  /**
   * Sometimes we are fetching an image and do not have the `src` immediately on mount.
   * If !src, we show a loading state for a few seconds before showing the failure state.
   * Clear the timeout if the src populates before the timeout expires.
   */
  useEffect(() => {
    if (!src && !timeoutRef.current) {
      // If not waiting timeout, show error immediately
      if (!waitForSrc) {
        setImageState('error');
      }

      timeoutRef.current = setTimeout(() => {
        setImageState('error');
      }, waitForSrc);
    }

    if (src && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    return () => {
      if (!timeoutRef.current) {
        return;
      }

      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    };
  }, [src, waitForSrc]);

  return (
    <picture
      className={classNames(styles.pictureWrapper, className, {
        [styles.stateError]: imageState === 'error',
        [styles.stateLoading]: loadingType === 'shine' && imageState === 'loading',
        [styles.stateReady]: imageState === 'ready',
      })}
      style={
        {
          '--image-block-size': typeof height === 'number' ? `${height}px` : height,
          '--image-error-background-image': `url(${NoiceLogo})`,
          '--image-fit': fit,
          '--image-inline-size': typeof width === 'number' ? `${width}px` : width,
        } as CSSProperties
      }
    >
      {sources?.map((source) => (
        <source
          key={`${source.media}-${source.srcSet}-${source.type}`}
          {...source}
        />
      ))}

      <img
        {...htmlAttributes}
        alt={alt || ''}
        className={styles.image}
        decoding="async"
        // fetchPriority={priority}
        height={height}
        loading="lazy"
        ref={ref}
        role={!alt ? 'presentation' : undefined}
        sizes={sizes ?? sizesFallback}
        src={
          fetchImageFromCDN
            ? `https://cf-cdn.noice.com/?image=${src}&width=${supportedSizes.at(
                -1,
              )}&quality=${quality}`
            : src
        }
        srcSet={
          srcSet ?? fetchImageFromCDN ? generateSrcSet({ src, quality }) : undefined
        }
        onError={handleOnError}
        onLoad={handleOnLoad}
      />
    </picture>
  );
});
