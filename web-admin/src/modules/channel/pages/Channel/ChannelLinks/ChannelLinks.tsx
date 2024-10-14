import { TextField } from '@common/input';
import { ChannelChannelLink, ChannelChannelLinkLinkType } from '@gen';

interface Props {
  links: ChannelChannelLink[];
}

export function ChannelLinks({ links }: Props) {
  const discordLink =
    links.find((link) => link.type === ChannelChannelLinkLinkType.LinkTypeDiscord)?.url ||
    '';
  const youtubeLink =
    links.find((link) => link.type === ChannelChannelLinkLinkType.LinkTypeYoutube)?.url ||
    '';
  const twitterLink =
    links.find((link) => link.type === ChannelChannelLinkLinkType.LinkTypeTwitter)?.url ||
    '';
  const customLinks = links
    .filter((link) => link.type === ChannelChannelLinkLinkType.LinkTypeCustom)
    .map((link) => ({ url: link.url, name: link.name }));

  return (
    <>
      {!!discordLink && (
        <TextField
          defaultValue={discordLink}
          label="Discord"
          type="url"
          readOnly
        />
      )}

      {!!youtubeLink && (
        <TextField
          defaultValue={youtubeLink}
          label="Youtube"
          type="url"
          readOnly
        />
      )}

      {!!twitterLink && (
        <TextField
          defaultValue={twitterLink}
          label="Twitter"
          type="url"
          readOnly
        />
      )}

      {customLinks.map((link, index) => (
        <TextField
          defaultValue={link.url}
          key={index}
          label={link.name}
          type="url"
          readOnly
        />
      ))}
    </>
  );
}
