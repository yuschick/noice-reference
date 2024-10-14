import {
  autoUpdate,
  computePosition,
  Placement,
  offset,
  flip,
  shift,
  arrow,
} from '@floating-ui/dom';
import { CoreAssets } from '@noice-com/assets-core';
import { useMountEffect } from '@noice-com/common-react-core';
import {
  FTUEActions,
  FTUEActionType,
  Markup,
  useListenToFTUEAction,
  IconButton,
  Button,
  Image,
  Icon,
} from '@noice-com/common-ui';
import {
  ConfigItemAlignment,
  ConfigItemMessageType,
} from '@noice-com/schemas/ftue/ftue.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import classNames from 'classnames';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FocusOn } from 'react-focus-on';

import { FtueConfigItem } from '../types';

import styles from './FTUEComponent.module.css';

import { VideoPlayer } from '@common/video';
import { FtueDismissalType } from '@gen';

export interface FTUEComponentProps extends Omit<FtueConfigItem, 'shouldShow'> {
  anchor: HTMLElement;
  isWide?: boolean; // @todo support this
  setFTUEDismissed(id: string, type: FtueDismissalType): void;
  setFTUEDisplayed(id: string, messageType: ConfigItemMessageType): void;
}

const { logError } = makeLoggers('FTUEComponent');

const placement: Record<ConfigItemAlignment, Placement | undefined> = {
  [ConfigItemAlignment.ALIGNMENT_UNSPECIFIED]: undefined,
  [ConfigItemAlignment.ALIGNMENT_TOP]: 'top',
  [ConfigItemAlignment.ALIGNMENT_LEFT]: 'left',
  [ConfigItemAlignment.ALIGNMENT_BOTTOM]: 'bottom',
  [ConfigItemAlignment.ALIGNMENT_RIGHT]: 'right',
  [ConfigItemAlignment.ALIGNMENT_CENTER]: undefined,
};

export function FTUEComponent({
  id,
  title,
  body,
  anchor,
  alignment,
  action,
  link,
  buttonText: buttonTextProp,
  isWide,
  imageContentUrl,
  videoContentUrl,
  showVideoAsGif,
  delayedShow,
  setFTUEDismissed,
  setFTUEDisplayed,
  messageType,
}: FTUEComponentProps) {
  const component = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [renderedPlacement, setRenderedPlacement] = useState<Nullable<Placement>>(null);

  const isCenter = alignment === ConfigItemAlignment.ALIGNMENT_CENTER;
  const isLinkType = messageType === ConfigItemMessageType.MESSAGE_TYPE_LINK && link;

  const buttonText = buttonTextProp ?? 'Got it!';

  const onActionEvent = useCallback(() => {
    if (!id) {
      return;
    }

    setFTUEDismissed(id, FtueDismissalType.DismissalTypeActionTaken);
  }, [id, setFTUEDismissed]);

  const onButtonClick = useCallback(() => {
    if (!id) {
      logError('No id for FTUE component on button click');
      return;
    }

    if (!isLinkType) {
      setFTUEDismissed(id, FtueDismissalType.DismissalTypeClosed);
      return;
    }

    setFTUEDismissed(id, FtueDismissalType.DismissalTypeActionTaken);
    window.open(link, '_blank');
  }, [id, isLinkType, link, setFTUEDismissed]);

  const onCloseClick = useCallback(() => {
    if (!id) {
      logError('No id for FTUE component on close click');
      return;
    }

    setFTUEDismissed(id, FtueDismissalType.DismissalTypeClosed);
  }, [id, setFTUEDismissed]);

  const actionEvent = useMemo(() => {
    if (!action) {
      return;
    }

    // Check if action is part of event enum
    if (Object.values(FTUEActionType).includes(action as FTUEActionType)) {
      return action as keyof FTUEActions;
    }
  }, [action]);

  useListenToFTUEAction(actionEvent, onActionEvent);

  useMountEffect(() => {
    if (!alignment || alignment === ConfigItemAlignment.ALIGNMENT_UNSPECIFIED) {
      return;
    }

    if (isCenter) {
      setVisible(true);
      return;
    }

    let cleanup: ReturnType<typeof autoUpdate>;

    const createFloatingUi = async () => {
      if (!component.current) {
        return;
      }

      const {
        x,
        y,
        placement: renderedPlacement,
        middlewareData,
      } = await computePosition(anchor, component.current, {
        placement: placement[alignment],
        middleware: [
          // Offsets the FTUE from the anchor
          offset({
            crossAxis: 0,
            mainAxis: 32,
          }),
          // Makes sure the FTUE doesn't go off screen on the top or bottom
          shift({ padding: 8 }),
          // Makes sure the FTUE doesn't go off screen on the left or right
          flip({
            crossAxis: false,
          }),
          // gives anchor position
          arrowRef.current
            ? arrow({
                element: arrowRef.current,
              })
            : undefined,
        ],
      });

      setRenderedPlacement(renderedPlacement);

      Object.assign(component.current.style, {
        insetInlineStart: `${x}px`,
        insetBlockStart: `${y}px`,
      });

      if (arrowRef.current && middlewareData.arrow) {
        Object.assign(arrowRef.current.style, {
          insetInlineStart: `${middlewareData.arrow.x}px`,
          insetBlockStart: `${middlewareData.arrow.y}px`,
        });
      }
    };

    const timeout = setTimeout(() => {
      if (!component.current || !id || !messageType) {
        return;
      }

      cleanup = autoUpdate(anchor, component.current, createFloatingUi);
      setVisible(true);

      setFTUEDisplayed(id, messageType);

      // Time out is either from configs or small one to give animations time to animate anchor component
    }, delayedShow || 500);

    return () => {
      cleanup?.();
      clearTimeout(timeout);
    };
  });

  const FTUEWrapperElement = isCenter ? FocusOn : 'div';
  const HeadingWrapperElement = isCenter ? 'h1' : 'span';

  return (
    <>
      {isCenter && <div className={styles.darkenOverlay} />}
      <FTUEWrapperElement>
        <div
          className={classNames(styles.ftue, {
            [styles.center]: isCenter,
            [styles.isLinkType]: isLinkType,
          })}
          data-placement={renderedPlacement}
          ref={component}
        >
          <section
            className={classNames(styles.wrapper, {
              [styles.wide]: isWide,
              [styles.visible]: visible,
            })}
          >
            <div className={styles.titleWrapper}>
              <HeadingWrapperElement className={styles.title}>
                {!!title && <Markup content={title} />}
              </HeadingWrapperElement>
              {!!isLinkType && (
                <IconButton
                  icon={CoreAssets.Icons.Close}
                  label="Close"
                  onClick={onCloseClick}
                />
              )}
            </div>

            <div className={styles.content}>
              {!!imageContentUrl && !videoContentUrl && (
                <Image
                  alt=""
                  className={styles.image}
                  src={imageContentUrl}
                />
              )}

              {!!videoContentUrl && (
                <VideoPlayer
                  className={styles.video}
                  disabledControls={
                    showVideoAsGif
                      ? ['mute', 'fullscreen', 'play', 'seek', 'time', 'volume']
                      : ['mute']
                  }
                  loop={showVideoAsGif}
                  poster={imageContentUrl}
                  src={videoContentUrl}
                  volume={showVideoAsGif ? 0 : 1}
                  autoPlay
                />
              )}

              {!!body && (
                <Markup
                  className={styles.text}
                  content={body}
                />
              )}
            </div>

            <Button
              theme="dark"
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
            {!isCenter && (
              <div
                className={styles.tickWrapper}
                ref={arrowRef}
              >
                <Icon
                  aria-hidden="true"
                  className={styles.tickIcon}
                  icon={CoreAssets.Icons.ChevronRight}
                />
              </div>
            )}
          </section>
        </div>
      </FTUEWrapperElement>
    </>
  );
}
