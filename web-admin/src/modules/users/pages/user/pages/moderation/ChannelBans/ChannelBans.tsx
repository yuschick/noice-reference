import { gql } from '@apollo/client';
import { CommonUtils } from '@noice-com/common-ui';
import { DateAndTimeUtils, Nullable } from '@noice-com/utils';
import { useLocation } from 'react-router';

import styles from './ChannelBans.module.css';

import { ButtonLink } from '@common/button';
import { ContentModulePage } from '@common/page-components';
import { ModerationChannelBanFragment } from '@gen';

interface Props {
  channelBans: Nullable<ModerationChannelBanFragment[]>;
}

export function ChannelBans({ channelBans }: Props) {
  const location = useLocation();

  const data =
    channelBans?.map((item) =>
      (({ channel, violation, bannedAt }) => ({
        channel: channel.name,
        violation: CommonUtils.getChannelViolationText(violation),
        bannedAt: `${DateAndTimeUtils.getShortDate(bannedAt)} ${DateAndTimeUtils.getTime(
          bannedAt,
        )}`,
      }))(item),
    ) ?? [];

  return (
    <ContentModulePage.TableContent
      data={data}
      title="Channel bans"
    >
      {!!data.length && (
        <div className={styles.buttonWrapper}>
          <ButtonLink
            buttonType="ghost"
            text="See all channel bans"
            to={`${location.pathname}/channel-bans`}
          />
        </div>
      )}
    </ContentModulePage.TableContent>
  );
}

ChannelBans.fragments = {
  entry: gql`
    fragment ModerationChannelBan on ChannelBannedUser {
      channel {
        id
        name
      }
      bannedAt
      violation
    }
  `,
};
