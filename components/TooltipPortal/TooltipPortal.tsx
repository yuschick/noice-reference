import {
  computePosition,
  arrow,
  offset as offsetMiddleWare,
  Placement,
  shift,
  Middleware,
} from '@floating-ui/dom';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  RefObject,
  CSSProperties,
  useId,
} from 'react';
import { createPortal } from 'react-dom';

import styles from './TooltipPortal.module.css';

import { SetTimeoutId, WithChildren } from '@common-types';

export interface Props {
  anchorRef: RefObject<HTMLElement>;
  delay?: number;
  disabled?: boolean;
  hideArrow?: boolean;
  /* The tooltip distance from the anchor */
  distance?: number;
  /* The offset from placement */
  offset?: number;
  placement?: Placement;
  forceShow?: boolean;
  className?: string;
  middleWare?: Middleware[];
  portalElementId?: string;
}

/**
 * @deprecated Please use the `Tooltip` component instead
 */
export function TooltipPortal({
  children,
  anchorRef,
  delay,
  disabled,
  placement,
  offset,
  className,
  hideArrow,
  distance,
  forceShow,
  middleWare: middleware,
  portalElementId,
}: WithChildren<Props>) {
  const id = useId();

  const tooltip = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const hideTooltipDebounceTimeout = useRef<SetTimeoutId>();
  const rendered = useRef(false);

  const [renderTooltip, setRenderTooltip] = useState(false);
  const [show, setShow] = useState(false);
  const [renderedPlacement, setRenderedPlacement] = useState<Nullable<Placement>>(null);

  const removeRenderedTooltip = useCallback(() => {
    setRenderTooltip(false);
    setShow(false);
    rendered.current = false;
  }, []);

  const onAnimationStart = () => {
    // Set tooltip as rendered when animation starts
    rendered.current = true;
  };

  const onAnimationEnd = () => {
    // If not hide, it is the appear animation
    if (show) {
      return;
    }

    // When disappear animation is ended, destroy tooltip
    removeRenderedTooltip();
  };

  // Set the correct aria attributes
  useEffect(() => {
    if (!anchorRef.current || disabled) {
      return;
    }

    if (
      show &&
      (anchorRef.current.tagName === 'BUTTON' || anchorRef.current.tagName === 'A')
    ) {
      anchorRef.current.setAttribute('aria-describedby', id);
    }
  }, [anchorRef, disabled, id, show]);

  // In case we want to just force show tooltip without mouse over listeners
  useEffect(() => {
    if (forceShow === undefined) {
      return;
    }

    if (forceShow) {
      setRenderTooltip(true);
      return;
    }

    // If not rendered yet, just destroy
    if (!rendered.current) {
      removeRenderedTooltip();
      return;
    }

    // Set tooltip to be hide
    setShow(false);
  }, [forceShow, removeRenderedTooltip]);

  const hideTooltip = useCallback(() => {
    // If not rendered yet, just destroy
    if (!rendered.current) {
      removeRenderedTooltip();
      return;
    }

    // Set tooltip to be hide
    setShow(false);
  }, [removeRenderedTooltip]);

  const debounceHideTooltip = useCallback(() => {
    if (hideTooltipDebounceTimeout.current) {
      clearTimeout(hideTooltipDebounceTimeout.current);
    }
    hideTooltipDebounceTimeout.current = setTimeout(hideTooltip, 50);
  }, [hideTooltip]);

  // Setup anchor mouse over listeners
  useEffect(() => {
    // if tooltip is shown anyway, no need to setup listeners
    if (forceShow) {
      return;
    }

    if (disabled) {
      hideTooltip();
      return;
    }

    if (!anchorRef.current) {
      return;
    }

    const anchorElement = anchorRef.current;

    const onAnchorMouseEnter = () => {
      if (hideTooltipDebounceTimeout.current) {
        clearTimeout(hideTooltipDebounceTimeout.current);
      }
      // Render tooltip when mouse enter
      setRenderTooltip(true);
    };

    const onAnchorMouseLeave = () => {
      debounceHideTooltip();
    };

    const onAnchorBlur = () => {
      hideTooltip();
    };

    const onAnchorKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideTooltip();
      }
    };

    anchorElement.onmouseenter = onAnchorMouseEnter;
    anchorElement.onfocus = onAnchorMouseEnter;
    anchorElement.onmouseleave = onAnchorMouseLeave;
    anchorElement.onblur = onAnchorBlur;
    anchorElement.onkeydown = onAnchorKeydown;

    return () => {
      anchorElement.onmouseenter = null;
      anchorElement.onfocus = null;
      anchorElement.onmouseleave = null;
      anchorElement.onblur = null;
      anchorElement.onkeydown = null;
    };
  }, [anchorRef, debounceHideTooltip, disabled, forceShow, hideTooltip]);

  // Setup tooltip mouse over listeners
  useEffect(() => {
    if (!renderTooltip || !tooltip.current) {
      return;
    }

    const tooltipElement = tooltip.current;

    const onTooltipMouseEnter = () => {
      if (hideTooltipDebounceTimeout.current) {
        clearTimeout(hideTooltipDebounceTimeout.current);
      }
    };

    const onTooltipMouseLeave = () => {
      debounceHideTooltip();
    };

    tooltipElement.onmouseenter = onTooltipMouseEnter;
    tooltipElement.onmouseleave = onTooltipMouseLeave;

    return () => {
      tooltipElement.onmouseenter = null;
      tooltipElement.onmouseleave = null;
    };
  }, [debounceHideTooltip, renderTooltip]);

  const createFloatingUi = useCallback(
    async (anchor: HTMLElement, tooltip: HTMLElement) => {
      const {
        x,
        y,
        middlewareData,
        placement: renderedPlacement,
      } = await computePosition(anchor, tooltip, {
        strategy: 'fixed',
        placement,
        middleware: [
          // prevents tooltip from going off screen
          shift({
            padding: 8,
          }),
          // offsets tooltip from anchor
          offsetMiddleWare({
            crossAxis: offset ?? 0,
            mainAxis: distance ?? 8,
          }),
          // middleware from props
          ...(middleware ?? []),
          // gives anchor position,
          // most be last so it gets other middleware data
          arrowRef.current
            ? arrow({
                element: arrowRef.current,
              })
            : undefined,
        ],
      });

      Object.assign(tooltip.style, {
        insetInlineStart: `${x}px`,
        insetBlockStart: `${y}px`,
      });

      setRenderedPlacement(renderedPlacement);

      if (arrowRef.current && middlewareData.arrow) {
        Object.assign(arrowRef.current.style, {
          insetInlineStart: `${middlewareData.arrow.x}px`,
          insetBlockStart: `${middlewareData.arrow.y}px`,
        });
      }
    },
    [distance, middleware, offset, placement],
  );

  // Setup floating ui
  useLayoutEffect(() => {
    // Do nothing in this hook if not renderer
    if (!renderTooltip || !anchorRef.current || !tooltip.current) {
      return;
    }

    // Create floating ui and show tooltip
    createFloatingUi(anchorRef.current, tooltip.current);

    setShow(true);
  }, [anchorRef, createFloatingUi, renderTooltip]);

  if (!children || !renderTooltip) {
    return null;
  }

  const portalElement = document.getElementById(portalElementId ?? 'portals');

  if (!portalElement) {
    throw new Error("Can't find tooltip portal element");
  }

  return (
    <>
      {createPortal(
        <div
          className={classNames(styles.wrapper, className, {
            [styles.hide]: !show,
            [styles.show]: show,
          })}
          data-placement={renderedPlacement}
          id={id}
          ref={tooltip}
          role="tooltip"
          style={
            {
              '--tooltip-portal-delay': delay ? `${delay}ms` : undefined,
            } as CSSProperties
          }
          tabIndex={-1}
          onAnimationEnd={onAnimationEnd}
          onAnimationStart={onAnimationStart}
        >
          {children}

          {!hideArrow && (
            <div
              className={styles.arrow}
              ref={arrowRef}
            />
          )}
        </div>,
        portalElement,
      )}
    </>
  );
}
