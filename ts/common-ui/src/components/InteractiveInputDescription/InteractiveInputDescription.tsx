import styles from './InteractiveInputDescription.module.css';

interface Props {
  description: string;
  id: string;
}

export function InteractiveInputDescription({ description, id }: Props) {
  return (
    <span
      className={styles.inputDescription}
      id={id}
    >
      {description}
    </span>
  );
}
