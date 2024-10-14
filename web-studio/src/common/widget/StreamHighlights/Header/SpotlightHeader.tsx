import styles from './SpotlightHeader.module.css';

interface Props {
  label: string;
}

export function SpotlightHeader({ label }: Props) {
  return <header className={styles.header}>{label}</header>;
}
