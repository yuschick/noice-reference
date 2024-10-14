import classNames from 'classnames';

import { VisuallyHidden } from '../VisuallyHidden';

import styles from './SlideControl.module.css';

interface Props {
  className?: string;
  slideIds: string[];
  activeSlide: number;
  onSlideControlClick(value: number): void;
}

export function SlideControl({
  className,
  slideIds,
  activeSlide,
  onSlideControlClick,
}: Props) {
  return (
    <div className={classNames(styles.slideControlGroup, className)}>
      {slideIds.map((id, index) => (
        <button
          aria-current={activeSlide === index}
          className={styles.slideControlButton}
          key={id}
          type="button"
          onClick={() => onSlideControlClick(index)}
        >
          <VisuallyHidden>Go to slide {index + 1}</VisuallyHidden>
        </button>
      ))}
    </div>
  );
}
