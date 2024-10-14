import { gql } from '@apollo/client';
import { Anchor, PopoverMenu, useAnalytics, useDialog } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { generatePath } from 'react-router';

import styles from './ChannelButtonSection.module.css';

import { Routes } from '@common/route';
import { ChannelButtonOwnChannelFragment, ChannelButtonProfileFragment } from '@gen';

gql`
  fragment ChannelButtonOwnChannel on ChannelChannel {
    name
  }

  fragment ChannelButtonProfile on ProfileProfile {
    temporary
    account {
      uid
      channelCreationEligibility {
        canCreateChannel
      }
    }
  }
`;

interface Props {
  createChannelDialogStore: ReturnType<typeof useDialog>;
  ownChannel: Nullable<ChannelButtonOwnChannelFragment>;
  profile: Nullable<ChannelButtonProfileFragment>;
  onLinkClick(): void;
}

export function ChannelButtonSection({
  ownChannel,
  onLinkClick,
  profile,
  createChannelDialogStore,
}: Props) {
  const { trackButtonClickEventOnMouseClick, trackAnchorClick } = useAnalytics();

  if (ownChannel) {
    return (
      <PopoverMenu.Section>
        <PopoverMenu.Link
          to={generatePath(Routes.Channel, { channelName: ownChannel.name })}
          onClick={onLinkClick}
        >
          Channel
        </PopoverMenu.Link>
        <PopoverMenu.Link
          to={`${NOICE.STUDIO_URL}/${ownChannel.name.toLowerCase()}`}
          onClick={(e) => {
            trackAnchorClick(e, 'profile-menu');
            onLinkClick();
          }}
        >
          Go to Studio
        </PopoverMenu.Link>
      </PopoverMenu.Section>
    );
  }

  if (!profile || profile.temporary) {
    return null;
  }

  const canCreateChannel = profile.account?.channelCreationEligibility.canCreateChannel;

  return (
    <PopoverMenu.Section>
      <PopoverMenu.Button
        isDisabled={!canCreateChannel}
        onClick={(e) => {
          trackButtonClickEventOnMouseClick(e, 'profile-menu');
          createChannelDialogStore.actions.open();
        }}
      >
        Become a Creator
      </PopoverMenu.Button>

      {!canCreateChannel && (
        <div className={styles.channelCreationRequirements}>
          Check out the{' '}
          <Anchor
            href="https://support.noice.com/hc/en-us/articles/21228542907293"
            onClick={(e) => {
              trackAnchorClick(e, 'profile-menu');
            }}
          >
            requirements to become a creator
          </Anchor>
          .
        </div>
      )}
    </PopoverMenu.Section>
  );
}
