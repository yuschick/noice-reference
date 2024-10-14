import { Anchor } from '@noice-com/common-ui';
import { useId } from 'react';

import styles from './NightbotAuthorization.module.css';

export function NightbotAuthorization() {
  const id = useId();

  return (
    <div className={styles.wrapper}>
      <h2
        className={styles.listTitle}
        id={id}
      >
        Clicking Authorize below will allow Nightbot to:
      </h2>

      <ul
        aria-labelledby={id}
        className={styles.list}
      >
        <li>Get your profile information and email.</li>
        <li>Get your channel information.</li>
        <li>Update your channel title.</li>
        <li>Read messages in the public stream chat.</li>
        <li>
          Get subscription, follower and moderator status of the users in your chats.
        </li>
        <li>Send messages to the public stream chat.</li>
        <li>Moderate the public stream chat: delete messages and ban users.</li>
      </ul>

      <hr className={styles.divider} />

      <h2 className={styles.bottomTitle}>Make sure you trust Nightbot</h2>

      <p>
        By clicking Authorize, you are allowing Nightbot to access all the items listed
        above and allowing both Nightbot and Noice to use your information.
        <br />
        See Nightbot’s <Anchor href="https://nightbot.tv/terms">
          Terms of service
        </Anchor>{' '}
        and <Anchor href="https://nightbot.tv/privacy">Privacy policy</Anchor>
      </p>
    </div>
  );
}
