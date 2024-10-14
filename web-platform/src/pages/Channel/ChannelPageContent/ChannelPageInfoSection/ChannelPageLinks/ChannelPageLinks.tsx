import { gql } from '@apollo/client';
import { Anchor, Icon, LoadingSkeleton } from '@noice-com/common-ui';
import { IconType } from 'react-icons';
import { FaDiscord, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { IoLink } from 'react-icons/io5';

import styles from './ChannelPageLinks.module.css';

import { ChannelChannelLinkLinkType, ChannelPageLinksChannelFragment } from '@gen';

gql`
  fragment ChannelPageLinksChannel on ChannelChannel {
    links {
      type
      name
      url
    }
  }
`;

interface Props {
  channel: ChannelPageLinksChannelFragment;
}

const linkNameMap: Record<ChannelChannelLinkLinkType, { name: string; icon: IconType }> =
  {
    [ChannelChannelLinkLinkType.LinkTypeCustom]: {
      name: 'Unknown Link',
      icon: IoLink,
    },
    [ChannelChannelLinkLinkType.LinkTypeDiscord]: {
      name: 'Discord',
      icon: FaDiscord,
    },
    [ChannelChannelLinkLinkType.LinkTypeFacebook]: {
      name: 'Facebook',
      icon: FaFacebook,
    },
    [ChannelChannelLinkLinkType.LinkTypeInstagram]: {
      name: 'Instagram',
      icon: FaInstagram,
    },
    [ChannelChannelLinkLinkType.LinkTypeTiktok]: {
      name: 'TiKTok',
      icon: FaTiktok,
    },
    [ChannelChannelLinkLinkType.LinkTypeTwitter]: {
      name: 'X',
      icon: FaSquareXTwitter,
    },
    [ChannelChannelLinkLinkType.LinkTypeUnspecified]: {
      name: 'Unknown Link',
      icon: IoLink,
    },
    [ChannelChannelLinkLinkType.LinkTypeYoutube]: {
      name: 'Youtube',
      icon: FaYoutube,
    },
  };

export function ChannelPageLinks({ channel }: Props) {
  const { links } = channel;

  const sortedLinks = [...links].sort((a, b) => {
    const aName = linkNameMap[a.type].name;
    const bName = linkNameMap[b.type].name;

    return aName > bName ? 1 : -1;
  });

  return (
    <ul className={styles.linkList}>
      {sortedLinks.map(
        (link, key) =>
          link.url && (
            <li
              className={styles.linkListItem}
              key={key}
            >
              <Anchor href={link.url}>
                <div className={styles.linkContent}>
                  <Icon
                    icon={linkNameMap[link.type].icon}
                    size={16}
                  />

                  {linkNameMap[link.type].name}
                </div>
              </Anchor>
            </li>
          ),
      )}
    </ul>
  );
}

ChannelPageLinks.Loading = () => (
  <div className={styles.linkList}>
    <LoadingSkeleton
      count={3}
      height={16}
      width={250}
    />
  </div>
);
