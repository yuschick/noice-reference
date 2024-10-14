import {
  ButtonLink,
  FullscreenSpinner,
  NoiceLogo,
  WithChildren,
} from '@noice-com/common-ui';
import { CSSProperties } from 'react';
import { Helmet } from 'react-helmet-async';

import styles from './NoAccessPage.module.css';

import background from '@assets/images/background-stream.webp';
import characters from '@assets/images/noice-hero-characters.webp';
import { Routes } from '@common/route';

interface Props extends WithChildren {
  title: string;
  withBackground?: boolean;
  loading?: boolean;
}

export function NoAccessPage({ title, children, loading, withBackground }: Props) {
  if (loading) {
    return <FullscreenSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <article
        className={styles.noAccessWrapper}
        style={
          withBackground
            ? ({
                '--background': `url(${background})`,
                '--characters': `url(${characters})`,
              } as CSSProperties)
            : {}
        }
      >
        <header className={styles.noAccessHeader}>
          <NoiceLogo
            height={40}
            theme="light"
            variant="horizontal"
          />

          <ButtonLink
            fit="content"
            size="sm"
            to={Routes.Logout}
          >
            Logout
          </ButtonLink>
        </header>
        <main className={styles.noAccessContentWrapper}>{children}</main>
      </article>
    </>
  );
}
