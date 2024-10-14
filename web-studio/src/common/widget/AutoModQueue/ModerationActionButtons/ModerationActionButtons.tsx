import { gql } from '@apollo/client';
import { Button } from '@noice-com/common-ui';

import {
  ApproveModerationItemMutationVariables,
  ChatModerationItemStatus,
  DenyModerationItemMutationVariables,
  useApproveModerationItemMutation,
  useDenyModerationItemMutation,
} from '@gen';

gql`
  mutation ApproveModerationItem($chatId: ID!, $moderationItemId: ID!) {
    allowChatModerationItem(chatId: $chatId, moderationItemId: $moderationItemId) {
      emptyTypeWorkaround
    }
  }
`;

gql`
  mutation DenyModerationItem($chatId: ID!, $moderationItemId: ID!) {
    denyChatModerationItem(chatId: $chatId, moderationItemId: $moderationItemId) {
      emptyTypeWorkaround
    }
  }
`;

const AllowButton = (props: ApproveModerationItemMutationVariables) => {
  const [allowModerationItemMutation, { loading }] = useApproveModerationItemMutation({
    variables: { ...props },
  });

  return (
    <Button
      isDisabled={loading}
      level="secondary"
      size="sm"
      variant="solid"
      onClick={() => allowModerationItemMutation()}
    >
      Allow
    </Button>
  );
};

const DenyButton = (props: DenyModerationItemMutationVariables) => {
  const [denyModerationItemMutation, { loading }] = useDenyModerationItemMutation({
    variables: { ...props },
  });

  return (
    <Button
      isDisabled={loading}
      level="secondary"
      size="sm"
      variant="solid"
      onClick={() => denyModerationItemMutation()}
    >
      Deny
    </Button>
  );
};

export interface ClearButtonProps {
  onClick: (id: string) => void;
  moderationItemId: string;
}

const ClearButton = (props: ClearButtonProps) => {
  return (
    <Button
      level="secondary"
      size="sm"
      variant="solid"
      onClick={() => props.onClick(props.moderationItemId)}
    >
      Clear
    </Button>
  );
};

interface Props {
  handleClear: (id: string) => void;
  status: ChatModerationItemStatus;
  chatId: string;
  moderationItemId: string;
}

export function ModerationActionButtons({
  status,
  chatId,
  moderationItemId,
  handleClear,
}: Props) {
  return status === ChatModerationItemStatus.StatusPending ? (
    <>
      <AllowButton
        chatId={chatId}
        moderationItemId={moderationItemId}
      />
      <DenyButton
        chatId={chatId}
        moderationItemId={moderationItemId}
      />
    </>
  ) : (
    <>
      <div></div>
      <ClearButton
        moderationItemId={moderationItemId}
        onClick={handleClear}
      />
    </>
  );
}
