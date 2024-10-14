import { ButtonLink, Icon } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties } from 'react';
import { IconType } from 'react-icons';
import { FaInfoCircle } from 'react-icons/fa';

import styles from './StoreSectionHeader.module.css';

import { Routes } from '@common/route';

interface Props {
  title: string;
  /** @default h2 */
  headingLevel?: 'h2' | 'h3';
  linkTo?: Routes | string;
  infoTextIcon?: IconType;
  infoText?: string;
  color?: string;
  id?: string;
  hideBorder?: boolean;
}

export function StoreSectionHeader({
  color,
  headingLevel = 'h2',
  hideBorder,
  id,
  infoText,
  infoTextIcon = FaInfoCircle,
  linkTo,
  title,
}: Props) {
  const TitleTag = headingLevel;

  return (
    <div
      className={styles.wrapper}
      id={id}
    >
      <div
        className={classNames(styles.container, { [styles.border]: !hideBorder })}
        style={
          {
            '--_border-color': color ? `var(--noi-color-${color})` : undefined,
          } as CSSProperties
        }
      >
        <TitleTag className={styles.mainHeader}>{title}</TitleTag>

        {!!infoText && (
          <div className={styles.infoWrapper}>
            <Icon
              icon={infoTextIcon}
              size={24}
            />

            <span>{infoText}</span>
          </div>
        )}
      </div>
      {!!linkTo && (
        <ButtonLink
          fit="content"
          level="secondary"
          size="sm"
          to={linkTo}
        >
          Go to Noice store
        </ButtonLink>
      )}
    </div>
  );
}
