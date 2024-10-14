import { ReactNode } from 'react';

import styles from './PageHeading.module.css';

interface Props {
  description?: string | ReactNode;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  title: string;
}

export function PageHeading({ description, headingLevel = 'h1', title }: Props) {
  const HeadingTag = headingLevel;

  return (
    <div className={styles.pageHeadingWrapper}>
      <div className={styles.textWrapper}>
        <HeadingTag className={styles.title}>{title}</HeadingTag>
        {!!description && <span>{description}</span>}
      </div>
    </div>
  );
}
