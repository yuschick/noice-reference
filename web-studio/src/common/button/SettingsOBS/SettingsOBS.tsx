import { CoreAssets } from '@noice-com/assets-core';
import { ButtonLink, VisuallyHidden } from '@noice-com/common-ui';
import { MouseEventHandler } from 'react';

interface Props {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export function SettingsOBS({ onClick }: Props) {
  return (
    <ButtonLink
      fit="content"
      iconEnd={CoreAssets.Icons.LinkExternal}
      rel="noopener noreferrer"
      size="sm"
      target="_blank"
      to="https://obsproject.com/"
      onClick={onClick}
    >
      OBS Website
      <VisuallyHidden>Opens in a new window</VisuallyHidden>
    </ButtonLink>
  );
}
