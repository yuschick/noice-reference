import { WithChildren } from '@noice-com/common-ui';

import styles from './TableContent.module.css';

import { Table, TableProps } from '@common/table';

interface Props extends WithChildren {
  title: string;
  data: TableProps['data'];
}

export function TableContent({ title, data, children }: Props) {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>

      <Table
        caption={title}
        data={data}
      />

      {children}
    </section>
  );
}
