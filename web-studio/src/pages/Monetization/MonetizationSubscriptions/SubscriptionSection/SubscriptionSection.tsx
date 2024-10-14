import { CoreAssets } from '@noice-com/assets-core';
import { Icon, WithChildren } from '@noice-com/common-ui';
import { JSX } from 'react';
import { To } from 'react-router';
import { Link } from 'react-router-dom';

import styles from './SubscriptionSection.module.css';

import { LayoutBox } from '@common/layout';

interface Props extends WithChildren {
  label: string;
  description: string;
  contentPreview?: JSX.Element;
}

export function SubscriptionSection({
  label,
  description,
  children,
  contentPreview,
}: Props) {
  return (
    <LayoutBox>
      <div className={styles.wrapper}>
        <div className={styles.labelWrapper}>
          <div>
            <div className={styles.label}>{label}</div>
            <div className={styles.description}>{description}</div>
          </div>
          {contentPreview}
        </div>
        {children}
      </div>
    </LayoutBox>
  );
}

export function SubscriptionSectionLink({ to, children, ...props }: Props & { to: To }) {
  return (
    <Link
      className={styles.link}
      to={to}
    >
      <SubscriptionSection {...props}>
        <div className={styles.linkChildren}>
          {children}
          <Icon
            className={styles.chevron}
            icon={CoreAssets.Icons.ChevronRight}
            size={16}
          />
        </div>
      </SubscriptionSection>
    </Link>
  );
}
