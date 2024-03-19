import {
  Placement,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';
import { Nullable } from '@noice-com/utils';
import { RefObject, useEffect, useId, useRef, useState } from 'react';

import { getRem } from '@common-utils';

interface UseTooltipResult {
  state: {
    portalElement: Nullable<HTMLElement>;
    tooltipDistance: string;
    tooltipId: string;
    tooltipIsHovered: boolean;
    tooltipIsVisible: boolean;
    tooltipRef: RefObject<HTMLDivElement>;
    tooltipTriggerRef: RefObject<HTMLElement>;
  };
}

interface Props {
  distance?: number;
  forceState?: 'hide' | 'show';
  initialState?: 'hide' | 'show';
  placement: Placement;
  renderIn?: 'portals' | 'inline' | string;
}

const INSTANCES = [
  HTMLButtonElement,
  HTMLAnchorElement,
  HTMLInputElement,
  HTMLTextAreaElement,
  HTMLSelectElement,
];

export function useTooltip({
  distance = 10,
  forceState,
  initialState = 'hide',
  placement,
  renderIn = 'portals',
}: Props): UseTooltipResult {
  const [tooltipHasFocus, setTooltipHasFocus] = useState(false);
  const [tooltipIsHovered, setTooltipIsHovered] = useState(false);
  const [tooltipIsVisible, setTooltipIsVisible] = useState(
    initialState === 'show' || forceState === 'show',
  );

  const tooltipId = useId();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipTriggerRef = useRef<HTMLElement>(null);

  const portalElement = renderIn !== 'inline' ? document.getElementById(renderIn) : null;

  if (renderIn !== 'inline' && !portalElement) {
    throw new Error('Tooltip: The provided portal element id cannot be found.');
  }

  useEffect(() => {
    if (!tooltipTriggerRef.current || forceState === 'hide') {
      return;
    }

    tooltipTriggerRef.current.setAttribute('aria-describedby', tooltipId);

    if (!INSTANCES.find((instance) => tooltipTriggerRef.current instanceof instance)) {
      tooltipTriggerRef.current.setAttribute('tabindex', '0');

      /* eslint-disable-next-line no-console */
      console.error(
        'The tooltip trigger must be one of the following instances: HTMLButtonElement, HTMLAnchorElement, HTMLInputElement, HTMLTextAreaElement, HTMLSelectElement.',
      );
    }
  }, [forceState, tooltipId]);

  /**
   * Handle tooltip trigger event listeners
   */
  useEffect(() => {
    const triggerElement = tooltipTriggerRef.current;
    const tooltipElement = tooltipRef.current;

    if (!triggerElement || forceState) {
      return;
    }

    const reset = () => {
      setTooltipIsVisible(false);
      setTooltipIsHovered(false);
      return;
    };

    triggerElement.addEventListener('mouseover', () => setTooltipIsVisible(true));
    triggerElement.addEventListener('mouseleave', reset);
    triggerElement.addEventListener('focusin', () => {
      setTooltipHasFocus(true);
      setTooltipIsVisible(true);
    });
    triggerElement.addEventListener('focusout', () => {
      reset();
      setTooltipHasFocus(false);
    });

    if (portalElement && tooltipElement) {
      tooltipElement.addEventListener('mouseover', () => setTooltipIsHovered(true));
      tooltipElement.addEventListener('mouseleave', () => setTooltipIsHovered(false));
    }

    return () => {
      triggerElement.removeEventListener('mouseover', () => setTooltipIsVisible(true));
      triggerElement.removeEventListener('mouseleave', reset);
      triggerElement.removeEventListener('focusin', () => {
        setTooltipHasFocus(true);
        setTooltipIsVisible(true);
      });
      triggerElement.removeEventListener('focusout', () => {
        reset();
        setTooltipHasFocus(false);
      });

      if (portalElement && tooltipElement) {
        tooltipElement.removeEventListener('mouseover', () => setTooltipIsHovered(true));
        tooltipElement.removeEventListener('mouseleave', () =>
          setTooltipIsHovered(false),
        );
      }
    };
  }, [forceState, portalElement, tooltipHasFocus, tooltipIsHovered, tooltipIsVisible]);

  /**
   * Handle FloatingUI positioning.
   */
  useEffect(() => {
    const triggerElement = tooltipTriggerRef.current;
    const tooltipElement = tooltipRef.current;

    if (!triggerElement || !tooltipElement || (!tooltipIsVisible && !tooltipIsHovered)) {
      return;
    }

    const cleanup = autoUpdate(triggerElement, tooltipElement, async () => {
      const { x, y } = await computePosition(triggerElement, tooltipElement, {
        placement,
        strategy: 'fixed',
        middleware: [
          flip(),
          shift({ padding: 4 }),
          offset({
            crossAxis: 0,
            mainAxis: distance,
          }),
        ],
      });

      Object.assign(tooltipElement.style, {
        insetBlockStart: `${y}px`,
        insetInlineStart: `${x}px`,
      });
    });

    return () => {
      cleanup();
    };
  }, [distance, placement, tooltipIsHovered, tooltipIsVisible]);

  return {
    state: {
      portalElement,
      tooltipDistance: getRem(distance),
      tooltipId,
      tooltipIsHovered,
      tooltipIsVisible,
      tooltipRef,
      tooltipTriggerRef,
    },
  };
}
