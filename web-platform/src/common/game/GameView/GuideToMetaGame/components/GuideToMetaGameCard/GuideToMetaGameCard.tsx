import { CoreAssets } from '@noice-com/assets-core';
import { Icon, Pill } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, ReactNode } from 'react';
import { To } from 'react-router';
import { Link } from 'react-router-dom';

import styles from './GuideToMetaGameCard.module.css';

import { usePlaySound, AppSoundKeys } from '@common/sound';

export interface Props {
  title: string;
  onClick?: () => void;
  to?: To;
  subtitle: string | ReactNode;
  color: 'teal' | 'purple' | 'magenta';
  backgroundAsset?: string;
  backgroundAssetClassName?: string;
  showNewBadge?: boolean;
  showHighlightAnimation?: boolean;
}

export function GuideToMetaGameCard({
  title,
  to,
  subtitle,
  color,
  backgroundAsset,
  backgroundAssetClassName,
  showNewBadge,
  showHighlightAnimation,
  onClick,
}: Props) {
  const [playGenericHover] = usePlaySound(AppSoundKeys.GenericHover);
  const [playClickConfirm] = usePlaySound(AppSoundKeys.ButtonClickConfirm);

  const onClickFunc = () => {
    playClickConfirm();
    onClick?.();
  };

  const onMouseEnter = () => {
    playGenericHover();
  };

  const cs = classNames(styles.container, {
    [styles.teal]: color === 'teal',
    [styles.purple]: color === 'purple',
    [styles.magenta]: color === 'magenta',
  });
  const style = {
    '--guide-to-metagame-bg-asset': backgroundAsset
      ? `url(${backgroundAsset})`
      : undefined,
  } as CSSProperties;
  const content = (
    <>
      {!!backgroundAsset && (
        <div className={classNames(styles.bgAsset, backgroundAssetClassName)}></div>
      )}
      <div className={styles.title}>{title}</div>

      <div className={styles.footer}>
        <div className={styles.subtitle}>{subtitle}</div>

        <Icon
          className={styles.icon}
          icon={CoreAssets.Icons.ChevronRight}
        />

        <div className={styles.footerBackground} />
      </div>
      {showHighlightAnimation && <div className={styles.highlightAnimation} />}

      {showNewBadge && (
        <div className={styles.badge}>
          <Pill
            color="gradient-green-teal"
            label="NEW"
          />
        </div>
      )}
    </>
  );

  return (
    <>
      {to ? (
        <Link
          className={cs}
          style={style}
          to={to}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
        >
          {content}
        </Link>
      ) : onClick ? (
        <button
          className={cs}
          style={style}
          onClick={onClickFunc}
          onMouseEnter={onMouseEnter}
        >
          {content}
        </button>
      ) : null}
    </>
  );
}
