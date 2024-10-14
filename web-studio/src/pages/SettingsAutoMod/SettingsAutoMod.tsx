import { gql } from '@apollo/client';
import { updateChannelModerationSettingsUpdateFunction } from '@noice-com/apollo-client-utils';
import { Switch } from '@noice-com/common-ui';

import { useChannelContext } from '@common/channel';
import { PageHeading, LayoutBox } from '@common/layout';
import { ChannelRole } from '@common/profile';
import { Option, SelectableList } from '@common/select';
import {
  ChatAutomodDecision,
  ChatAutomodLevel,
  useAutomodSettingsQuery,
  useUpdateAutomodSettingsMutation,
} from '@gen';

gql`
  query AutomodSettings($channelId: ID!) {
    channelModerationSettings(channelId: $channelId) {
      automod {
        level
        defaultDecision
      }
    }
  }
`;

gql`
  mutation UpdateAutomodSettings($channelId: ID!, $automod: ChannelAutomodSettingsInput) {
    updateChannelModerationSettings(body: { channelId: $channelId, automod: $automod }) {
      automod {
        level
        defaultDecision
      }
    }
  }
`;

const getAutomodToggleState = (
  automodLevel: Exclude<ChatAutomodLevel, ChatAutomodLevel.AutomodLevelUnspecified>,
) => {
  switch (automodLevel) {
    case ChatAutomodLevel.AutomodLevelHigh:
      return true;
    case ChatAutomodLevel.AutomodLevelLow:
      return false;
  }
};

const getAutomodSwitchDescription = (enabled: boolean) =>
  enabled
    ? "Automod is enabled. Chat messages with severe bullying, references to real-world violence, provocative sexual conversation, strongly vulgar language and some hateful slurs will go into your channel's Automod queue. Noice will always moderate content for areas such as child exploitation, spam, porn, severely hateful language, hateful incitement and real-world violence"
    : "Automod is disabled. Chat messages with severe bullying, references to real-world violence, provocative sexual conversation, strongly vulgar language and some hateful slurs will go into your channel's Automod queue. Noice will always moderate content for areas such as child exploitation, spam, porn, severely hateful language, hateful incitement and real-world violence";

const DecisionOptions: Option<
  Exclude<ChatAutomodDecision, ChatAutomodDecision.AutomodDecisionUnspecified>
>[] = [
  {
    label: 'Allow message',
    value: ChatAutomodDecision.AutomodDecisionAccepted,
  },
  {
    label: 'Deny message',
    value: ChatAutomodDecision.AutomodDecisionRejected,
  },
];

enum AutoModSetting {
  DECISION,
  LEVEL,
}

export function SettingsAutoMod() {
  const { channelId, userChannelRoles } = useChannelContext();
  const { loading, data } = useAutomodSettingsQuery({
    variables: { channelId },
  });
  const level = data?.channelModerationSettings?.automod.level;
  const decision = data?.channelModerationSettings?.automod.defaultDecision;

  const [updateAutoModSettings, { loading: updating }] = useUpdateAutomodSettingsMutation(
    {
      update: updateChannelModerationSettingsUpdateFunction,
    },
  );

  const onToggle = async (setting: AutoModSetting) => {
    let updatedLevel = level;
    let updatedDecision = decision;

    if (setting === AutoModSetting.LEVEL) {
      updatedLevel =
        level === ChatAutomodLevel.AutomodLevelHigh
          ? ChatAutomodLevel.AutomodLevelLow
          : ChatAutomodLevel.AutomodLevelHigh;
    }

    if (setting === AutoModSetting.DECISION) {
      updatedDecision =
        decision === ChatAutomodDecision.AutomodDecisionAccepted
          ? ChatAutomodDecision.AutomodDecisionRejected
          : ChatAutomodDecision.AutomodDecisionAccepted;
    }

    await updateAutoModSettings({
      variables: {
        channelId,
        automod: {
          level: updatedLevel,
          defaultDecision: updatedDecision,
        },
      },
    });
  };

  const isAutomodRestrictiveModeEnabled =
    level && level !== ChatAutomodLevel.AutomodLevelUnspecified
      ? getAutomodToggleState(level)
      : false;

  return (
    <>
      <PageHeading title="Automod" />

      {level && level !== ChatAutomodLevel.AutomodLevelUnspecified && (
        <LayoutBox>
          <Switch
            checked={isAutomodRestrictiveModeEnabled}
            description={getAutomodSwitchDescription(isAutomodRestrictiveModeEnabled)}
            disabled={userChannelRoles.every((role) => role === ChannelRole.Moderator)}
            isLoading={loading || updating}
            label="Automod - Restrictive mode"
            onChange={() => onToggle(AutoModSetting.LEVEL)}
          />
        </LayoutBox>
      )}

      {decision && decision !== ChatAutomodDecision.AutomodDecisionUnspecified && (
        <LayoutBox>
          <SelectableList
            disabled={userChannelRoles.every((role) => role === ChannelRole.Moderator)}
            label="Default decision on timeout"
            loading={loading || updating}
            options={DecisionOptions}
            selected={decision}
            onSelect={() => onToggle(AutoModSetting.DECISION)}
          />
        </LayoutBox>
      )}
    </>
  );
}
