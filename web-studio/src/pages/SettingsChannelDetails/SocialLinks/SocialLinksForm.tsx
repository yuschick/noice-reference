import { CoreAssets } from '@noice-com/assets-core';
import { Icon, InputField } from '@noice-com/common-ui';
import { useRef } from 'react';
import { FaSquareXTwitter } from 'react-icons/fa6';

import styles from './SocialLinksForm.module.css';

import { ChannelChannelLink, ChannelChannelLinkLinkType } from '@gen';

interface SocialLinksProps {
  links: ChannelChannelLink[];
  onChange: (links: ChannelChannelLink[]) => void;
}

type SocialLinks = Partial<Record<ChannelChannelLinkLinkType, ChannelChannelLink>>;

export function SocialLinksForm({ links, onChange }: SocialLinksProps) {
  const updatedLinks = useRef<ChannelChannelLink[]>([...links]);

  const initialLinks = links.reduce<SocialLinks>((acc, cur) => {
    acc[cur.type] = cur;
    return acc;
  }, {} as SocialLinks);

  const handleChange = ({
    platform,
    url,
  }: {
    platform: ChannelChannelLinkLinkType;
    url: string;
  }) => {
    // Update already updated link
    if (updatedLinks.current.some((link) => link.type === platform)) {
      updatedLinks.current = updatedLinks.current.map((link) =>
        link.type === platform ? { ...link, url } : link,
      );
    }
    // Add new updated link to updated array if there is a url
    else if (url) {
      updatedLinks.current = [
        ...updatedLinks.current,
        { __typename: 'ChannelChannelLink', name: '', type: platform, url },
      ];
    }

    onChange(updatedLinks.current);
  };

  const supportedPlatforms = [
    {
      icon: CoreAssets.Icons.Discord,
      label: 'Discord server',
      pattern: 'https://(www.)?discord.gg/(.+)',
      platform: ChannelChannelLinkLinkType.LinkTypeDiscord,
      url: initialLinks[ChannelChannelLinkLinkType.LinkTypeDiscord]?.url,
    },
    {
      icon: CoreAssets.Icons.Facebook,
      label: 'Facebook',
      pattern: 'https://(www.)?(facebook).com/(.+)',
      platform: ChannelChannelLinkLinkType.LinkTypeFacebook,
      url: initialLinks[ChannelChannelLinkLinkType.LinkTypeFacebook]?.url,
    },
    {
      icon: CoreAssets.Icons.Instagram,
      label: 'Instagram',
      pattern: 'https://(www.)?(instagram).com/(.+)',
      platform: ChannelChannelLinkLinkType.LinkTypeInstagram,
      url: initialLinks[ChannelChannelLinkLinkType.LinkTypeInstagram]?.url,
    },
    {
      icon: CoreAssets.Icons.Tiktok,
      label: 'TikTok',
      pattern: 'https://(www.)?(tiktok).com/@(.+)',
      platform: ChannelChannelLinkLinkType.LinkTypeTiktok,
      url: initialLinks[ChannelChannelLinkLinkType.LinkTypeTiktok]?.url,
    },
    {
      icon: FaSquareXTwitter,
      label: 'X (Formerly Twitter)',
      pattern: 'https://(www.)?(twitter|x).com/(.+)',
      platform: ChannelChannelLinkLinkType.LinkTypeTwitter,
      url: initialLinks[ChannelChannelLinkLinkType.LinkTypeTwitter]?.url,
    },
    {
      icon: CoreAssets.Icons.Youtube,
      label: 'YouTube',
      pattern: 'https://(www.)?youtube.com?/(.+)',
      platform: ChannelChannelLinkLinkType.LinkTypeYoutube,
      url: initialLinks[ChannelChannelLinkLinkType.LinkTypeYoutube]?.url,
    },
  ];

  return (
    <div className={styles.socialLinksWrapper}>
      {supportedPlatforms.map((platform) => (
        <InputField
          defaultValue={platform.url}
          key={platform.platform}
          label={platform.label}
          name={platform.platform}
          pattern={platform.pattern}
          size="lg"
          slots={{
            inputStart: (
              <Icon
                icon={platform.icon}
                size={18}
              />
            ),
          }}
          theme="gray"
          type="url"
          onBlur={(event) =>
            handleChange({
              platform: platform.platform,
              url: event.target.value ?? '',
            })
          }
          onChange={(event) =>
            handleChange({
              platform: platform.platform,
              url: event.target.value ?? '',
            })
          }
        />
      ))}
    </div>
  );
}
