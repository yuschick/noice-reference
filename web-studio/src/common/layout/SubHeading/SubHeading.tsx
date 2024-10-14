import styles from './SubHeading.module.css';

interface Props {
  title: string;
  description?: string;
}

export function SubHeading({ title, description }: Props) {
  return (
    <div className={styles.subHeading}>
      <h2 className={styles.title}>{title}</h2>
      {!!description && <span>{description}</span>}
    </div>
  );
}
