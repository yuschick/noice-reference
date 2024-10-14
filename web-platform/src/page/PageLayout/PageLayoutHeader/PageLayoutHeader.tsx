import { gql } from '@apollo/client';
import { useDetectStickyElement } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useRef } from 'react';

import styles from './PageLayoutHeader.module.css';

import { PageLayoutHeaderContent } from '@page/PageLayout/PageLayoutHeader/PageLayoutHeaderContent';

gql`
  fragment PageLayoutHeaderProfile on ProfileProfile {
    ...MenuButtonsProfile
    ...ProfileMenuProfile
  }
`;

type Props = Omit<
  React.ComponentProps<typeof PageLayoutHeaderContent>,
  'onSearchIconClick'
>;

export function PageLayoutHeader(props: Props) {
  const withTransparentHeader = true;
  const headerRef = useRef<HTMLElement>(null);
  const { elementIsStuck } = useDetectStickyElement({ ref: headerRef });

  return (
    <header
      className={classNames({
        [styles.withTransparentHeader]: withTransparentHeader,
      })}
      {...(withTransparentHeader ? { 'data-stuck': elementIsStuck } : {})}
      id={styles.platformLayoutHeader}
      ref={headerRef}
    >
      <PageLayoutHeaderContent
        {...props}
        contentTheme={elementIsStuck ? 'gray' : undefined}
      />
    </header>
  );
}
