import { WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';
import { AnimationEvent, CSSProperties, useRef, useState } from 'react';

import styles from './SegmentWrapper.module.css';

interface Props {
  duration: number;
}

enum State {
  Appear,
  Disappear,
}

const ANIMATION_LENGTH_MS = 300;

export function SegmentWrapper({ duration, children }: WithChildren<Props>) {
  const [state, setState] = useState<State>(State.Appear);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (state === State.Disappear || event.target !== wrapperRef.current) {
      return;
    }

    setState(State.Disappear);
  };

  const delay = duration - ANIMATION_LENGTH_MS * 2;

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.appear]: state === State.Appear,
        [styles.disappear]: state === State.Disappear,
      })}
      ref={wrapperRef}
      style={
        {
          '--spotlight-segment-wrapper-disappear-delay': `${delay}ms`,
          '--spotlight-segment-wrapper-animation-length': `${ANIMATION_LENGTH_MS}ms`,
        } as CSSProperties
      }
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
}
