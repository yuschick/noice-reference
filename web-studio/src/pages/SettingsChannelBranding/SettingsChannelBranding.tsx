import { gql } from '@apollo/client';
import { useBooleanFeatureFlag } from '@noice-com/common-ui';

import { ArenaBlock } from './ArenaBlock/ArenaBlock';
import { LogoImageBlock } from './LogoImageBlock/LogoImageBlock';
import { OfflineBannerBlock } from './OfflineBannerBlock/OfflineBannerBlock';
import styles from './SettingsChannelBranding.module.css';

import { useChannelContext } from '@common/channel';
import { PageHeading, SubHeading } from '@common/layout';
import { PermissionWrapper } from '@common/permission';
import { ChannelRole } from '@common/profile';
import { useSettingsChannelBrandingQuery } from '@gen';

gql`
  query SettingsChannelBranding($channelId: ID!) {
    channel(id: $channelId) {
      liveStatus
      id
      offlineBanner
      logo
      ...OfflineBannerBlockChannel
      ...LogoImageBlockChannel
    }
  }

  ${OfflineBannerBlock.fragments.entry}
  ${LogoImageBlock.fragments.entry}
`;

export function SettingsChannelBranding() {
  const { channelId } = useChannelContext();
  const [studioArenaSelect] = useBooleanFeatureFlag('studio_arenaSelect', false);

  const { data } = useSettingsChannelBrandingQuery({
    variables: { channelId },
  });

  if (!data?.channel) {
    return null;
  }

  return (
    <>
      <PageHeading title="Branding" />

      <section className={styles.section}>
        <SubHeading title="Channel logo" />

        <LogoImageBlock
          liveStatus={data.channel.liveStatus}
          logo={data.channel.logo}
          name={data.channel.name}
        />
      </section>

      <section className={styles.section}>
        <SubHeading title="Channel banner" />

        <OfflineBannerBlock offlineBanner={data?.channel?.offlineBanner} />
      </section>

      <PermissionWrapper
        forceHideFrom={studioArenaSelect ? [] : [ChannelRole.Streamer, ChannelRole.Admin]}
      >
        <section className={styles.section}>
          <SubHeading title="Arena" />

          <ArenaBlock channelId={channelId} />
        </section>
      </PermissionWrapper>
    </>
  );
}
