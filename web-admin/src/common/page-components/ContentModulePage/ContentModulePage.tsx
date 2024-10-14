import classNames from 'classnames';

import { ModulePage, Props as ModulePageProps } from '../ModulePage/ModulePage';

import { ContentArea } from './ContentArea/ContentArea';
import styles from './ContentModulePage.module.css';
import { TableContent } from './TableContent/TableContent';

interface Props extends ModulePageProps {
  isOneColumnPage?: boolean;
}

export function ContentModulePage({ children, isOneColumnPage, ...props }: Props) {
  return (
    <ModulePage {...props}>
      {isOneColumnPage ? children : <div className={styles.wrapper}>{children}</div>}
    </ModulePage>
  );
}

ContentModulePage.ContentEmpty = () => <section aria-hidden />;
ContentModulePage.Content = ContentArea;
ContentModulePage.TableContent = TableContent;

ContentModulePage.Item = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className={styles.item}>
      <span className={styles.itemLabel}>{label}</span>
      <span className={styles.itemValue}>{value}</span>
    </div>
  );
};

ContentModulePage.Loading = () => {
  return (
    <div className={classNames(styles.wrapper, styles.loading)}>
      <div className={styles.content}></div>
      <div className={styles.content}></div>
    </div>
  );
};

ContentModulePage.Error = () => {
  return <ModulePage.Error />;
};
