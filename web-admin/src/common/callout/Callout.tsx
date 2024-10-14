import { CoreAssets } from '@noice-com/assets-core';
import { Icon, SvgComponent } from '@noice-com/common-ui';
import classNames from 'classnames';
import { ReactNode, forwardRef } from 'react';
import { To } from 'react-router-dom';

import styles from './Callout.module.css';

import { ButtonLink } from '@common/button';

export const calloutTypes = ['error', 'info', 'positive', 'alert'] as const;

export interface Props {
  message: string | ReactNode;
  type: (typeof calloutTypes)[number];

  buttonLabel: string;
  linkTo: To;
}

function getCalloutIcon(type: Props['type']): SvgComponent {
  switch (type) {
    case 'error':
      return CoreAssets.Icons.Error;
    case 'info':
      return CoreAssets.Icons.Question;
    case 'positive':
      return CoreAssets.Icons.Check;
    case 'alert':
      return CoreAssets.Icons.Exclamation;
    default:
      return CoreAssets.Icons.Info;
  }
}

export const Callout = forwardRef<HTMLDivElement, Props>(function Callout(
  { message, type, buttonLabel, linkTo },
  externalRef,
) {
  return (
    <div
      className={classNames(styles.calloutWrapper, styles[type])}
      ref={externalRef}
    >
      <Icon
        className={styles.calloutIcon}
        icon={getCalloutIcon(type)}
        size={24}
      />

      {message}

      <ButtonLink
        text={buttonLabel}
        to={linkTo}
      />
    </div>
  );
});
