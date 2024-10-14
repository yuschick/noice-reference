import { BiLinkExternal } from 'react-icons/bi';
import { Link } from 'react-router-dom';

import { Icon } from '../../Icon';
import { VisuallyHidden } from '../../VisuallyHidden';

import styles from './AnnouncementLink.module.css';

import { WithChildren } from '@common-types';

interface Props {
  href: string;
  title: string;
}

export function AnnouncementLink({ children, href, title }: WithChildren<Props>) {
  if (href.startsWith('/')) {
    return (
      <Link
        title={title}
        to={href}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      className={styles.externalLink}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      title={title}
    >
      <span>{children}</span>
      <Icon
        icon={BiLinkExternal}
        size={16}
      />
      <VisuallyHidden> Link opens in a new window.</VisuallyHidden>
    </a>
  );
}
