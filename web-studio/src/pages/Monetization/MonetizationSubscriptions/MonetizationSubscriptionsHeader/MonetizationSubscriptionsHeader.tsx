import { ButtonLink, WithChildren } from '@noice-com/common-ui';
import { FaChevronLeft } from 'react-icons/fa';
import { To } from 'react-router';

import styles from './MonetizationSubscriptionsHeader.module.css';

import { PageHeading } from '@common/layout';

interface Props {
  title: string;
  description?: string;
  to?: To;
}

export const MonetizationSubscriptionsHeader = ({
  title,
  description,
  to,
  children,
}: Props & WithChildren) => {
  return (
    <header className={styles.header}>
      <div className={styles.navigation}>
        {!!to && (
          <ButtonLink
            fit="content"
            iconStart={FaChevronLeft}
            level="secondary"
            shape="circle"
            size="sm"
            to={to}
          />
        )}

        <PageHeading
          description={description}
          headingLevel="h2"
          title={title}
        />
      </div>

      {children}
    </header>
  );
};
