import styles from './FooterText.module.css';

interface Props {
  groupName: string;
}

export function FooterText({ groupName }: Props) {
  return (
    <span className={styles.text}>
      From
      <span className={styles.groupNameText}>{` ${groupName} `}</span>
      Team
    </span>
  );
}
