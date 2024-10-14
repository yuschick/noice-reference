import styles from './SeasonDialogDescription.module.css';

interface Props {
  title: string;
  description: string;
}

export function SeasonDialogDescription({ title, description }: Props) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{title}</span>
      <span className={styles.description}>{description}</span>
    </div>
  );
}
