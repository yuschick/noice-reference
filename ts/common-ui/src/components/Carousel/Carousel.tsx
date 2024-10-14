import classNames from 'classnames';
import { CSSProperties, useEffect, useRef, useState } from 'react';

import styles from './Carousel.module.css';
import { CarouselNavigationButton } from './CarouselNavigationButton/CarouselNavigationButton';

interface Props {
  slidesCount: number;
  displayCount?: number;
  /**
   * Non visible title for aria props
   */
  title: string;
  children?: React.ReactElement[];
  gap?: number;
}

export function Carousel({ slidesCount, displayCount = 3, title, children, gap }: Props) {
  const [leftNavVisible, setLeftNavVisible] = useState(false);
  const [rightNavVisible, setRightNavVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTabState = () => {
      if (!containerRef.current) {
        return;
      }

      // Is nav buttons visible
      const { clientWidth, scrollWidth } = containerRef.current;
      setRightNavVisible(clientWidth < scrollWidth ? true : false);
    };

    updateTabState();
    window.addEventListener('resize', updateTabState);

    return () => {
      window.removeEventListener('resize', updateTabState);
    };
  }, []);

  const onScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollLeft, clientWidth, scrollWidth } = event.currentTarget;

    const firstChildWidth = event.currentTarget?.firstElementChild?.clientWidth ?? 0;
    const lastChildWidth = event.currentTarget?.firstElementChild?.clientWidth ?? 0;

    const leftPaddingBeforeNavIsVisible = firstChildWidth / 2;
    const rightPaddingBeforeNavIsVisible = lastChildWidth / 2;

    const hasScrollLeft = scrollLeft > leftPaddingBeforeNavIsVisible;

    if (hasScrollLeft !== leftNavVisible) {
      setLeftNavVisible(hasScrollLeft);
    }

    const hasScrollRight =
      scrollLeft + clientWidth < scrollWidth - rightPaddingBeforeNavIsVisible;

    if (hasScrollRight !== rightNavVisible) {
      setRightNavVisible(hasScrollRight);
    }
  };

  const scrollTo = (dir = 1) => {
    if (!containerRef.current) {
      return;
    }

    const { clientWidth } = containerRef.current;
    containerRef.current.scrollBy({ left: (clientWidth / 2) * dir });
  };

  return (
    <section
      aria-label={`${title} carousel`}
      className={styles.section}
      style={
        {
          '--total-slide-count': slidesCount,
          '--display-item-count': Math.min(displayCount, slidesCount),
          '--display-item-gap': gap ?? 0,
        } as CSSProperties
      }
    >
      <CarouselNavigationButton
        disabled={!leftNavVisible}
        onClick={() => scrollTo(-1)}
      />
      <div
        className={styles.carouselContainer}
        ref={containerRef}
        onScroll={onScroll}
      >
        {children}
      </div>

      <CarouselNavigationButton
        direction="next"
        disabled={!rightNavVisible}
        onClick={() => scrollTo()}
      />
    </section>
  );
}

Carousel.Slide = ({
  children,
  className,
  index,
  style,
}: React.PropsWithChildren<{
  className?: string;
  index: number;
  style?: CSSProperties;
}>) => {
  return (
    <div
      aria-label={`Slide ${index + 1}`}
      className={classNames(styles.slideContainer, className)}
      role="group"
      style={style}
    >
      {children}
    </div>
  );
};
