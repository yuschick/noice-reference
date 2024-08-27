import { Placement } from '@floating-ui/dom';
import {
  CSSProperties,
  Children,
  ReactElement,
  ReactNode,
  RefCallback,
  RefObject,
  cloneElement,
} from 'react';
import { createPortal } from 'react-dom';

import { MountTransition } from '../MountTransition';

import styles from './Tooltip.module.css';
import { useTooltip } from './useTooltip.hook';

import { useMergeRefs } from '@common-hooks';
import { WithChildren } from '@common-types';

interface Props {
  content: string | ReactNode;
  delay?: number;
  distance?: number;
  forceState?: 'hide' | 'show';
  initialState?: 'hide' | 'show';
  placement: Placement;
  renderIn?: 'portals' | 'inline' | string;
  triggerRef?: RefObject<HTMLElement> | RefCallback<HTMLElement>;
}

export function Tooltip({
  children,
  content,
  delay = 10,
  distance = 10,
  forceState,
  initialState = 'hide',
  placement,
  renderIn = 'portals',
  triggerRef,
}: WithChildren<Props>) {
  const {
    state: {
      tooltipDistance,
      portalElement,
      tooltipId,
      tooltipIsHovered,
      tooltipIsVisible,
      tooltipRef,
      tooltipTriggerRef,
    },
  } = useTooltip({ distance, forceState, initialState, placement, renderIn });
  const ref = useMergeRefs([triggerRef, tooltipTriggerRef]);

  if (!content) {
    return children;
  }

  const TooltipContent = (
    <MountTransition
      duration="--noi-duration-quick"
      isShown={tooltipIsVisible || tooltipIsHovered}
      transitionClassName={styles.isVisible}
    >
      <div
        className={styles.tooltip}
        data-placement={placement}
        id={tooltipId}
        ref={tooltipRef}
        role="tooltip"
        style={
          {
            '--tooltip-delay': `${delay}ms`,
            '--tooltip-offset': tooltipDistance,
          } as CSSProperties
        }
      >
        <div className={styles.tooltipContent}>{content}</div>
        <div
          aria-hidden="true"
          className={styles.tooltipArrow}
          id="tooltip-arrow"
        />
      </div>
    </MountTransition>
  );

  return (
    <>
      {cloneElement(Children.only(children) as ReactElement, {
        ref,
      })}

      {forceState !== 'hide'
        ? portalElement
          ? createPortal(TooltipContent, portalElement)
          : TooltipContent
        : null}
    </>
  );
}
