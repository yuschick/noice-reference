import styles from './Subscriptions.module.css';
import { SubscriptionSettingList } from './SubscriptionSettingList/SubscriptionSettingList';

export function Subscriptions() {
  return (
    <section className={styles.wrapper}>
      <SubscriptionSettingList />
    </section>
  );
}
