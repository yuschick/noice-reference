import { ButtonLink, useAuthentication } from '@noice-com/common-ui';

import styles from './ChannelListPagesNavigation.module.css';

import { Routes } from '@common/route';

const pages = [
  { name: 'Discover', route: Routes.Home },
  { name: 'Browse', route: Routes.Browse },
  { name: 'Following', route: Routes.Following },
];

export function ChannelListPagesNavigation() {
  const { isFullAccount } = useAuthentication();

  return (
    <nav>
      <ul className={styles.channelListPagesNavigation}>
        {pages
          // Filter out the Following page if the user is not a full account
          .filter(({ route }) => isFullAccount || route !== Routes.Following)
          .map(({ name, route }) => (
            <li key={route}>
              <ButtonLink
                as="nav"
                size="sm"
                to={route}
              >
                {name}
              </ButtonLink>
            </li>
          ))}
      </ul>
    </nav>
  );
}
