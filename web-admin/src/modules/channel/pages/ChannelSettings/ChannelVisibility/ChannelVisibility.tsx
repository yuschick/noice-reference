import { gql } from '@apollo/client';

import { Toggle } from '@common/button';
import { ContentModulePage } from '@common/page-components';
import { showSnackbar } from '@common/snackbar';
import { ChannelVisibilityChannelFragment, useChannelUpdatePrivacyMutation } from '@gen';

gql`
  fragment ChannelVisibilityChannel on ChannelChannel {
    id
    isPublic
  }

  mutation ChannelUpdatePrivacy($channelId: ID!, $isPublic: Boolean) {
    updateChannelDetails(body: { id: $channelId, isPublic: $isPublic }) {
      id
      isPublic
    }
  }
`;

interface Props {
  channel: ChannelVisibilityChannelFragment;
}

export function ChannelVisibility({ channel }: Props) {
  const { id: channelId, isPublic } = channel;

  const [updateChannelPrivacy] = useChannelUpdatePrivacyMutation({
    variables: { channelId: channelId, isPublic: !isPublic },
    update(cache, _result, { variables }) {
      cache.updateFragment(
        {
          id: cache.identify({ id: channelId, __typename: 'ChannelChannel' }),
          fragment: gql`
            fragment PrivacyUpdateChannel on ChannelChannel {
              id
              isPublic
            }
          `,
        },
        (existingChannel) => ({
          ...existingChannel,
          isPublic: variables?.isPublic,
        }),
      );
    },
    onCompleted() {
      showSnackbar('positive', 'Channel privacy updated successfully.');
    },
    onError(error) {
      showSnackbar(
        'error',
        `Error occurred while updating channel privacy: ${error.message}`,
      );
    },
  });

  return (
    <ContentModulePage.Content title="Channel visibility">
      <Toggle
        label="Unlisted channel"
        offText="Channel is shown in the public channel lists."
        value={!isPublic}
        onChange={() => updateChannelPrivacy()}
        onText="Channel is hidden in the public channel lists."
      />
    </ContentModulePage.Content>
  );
}
