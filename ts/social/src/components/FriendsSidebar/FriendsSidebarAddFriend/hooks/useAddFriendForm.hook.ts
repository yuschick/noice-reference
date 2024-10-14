import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useResolvedAddFriendUserTagLazyQuery } from '@social-gen';
import { useSendFriendRequestMutation } from '@social-hooks';

interface HookResult {
  inputValue: string;
  success: boolean;
  loading: boolean;
  error: Nullable<string>;
  onInputChange(event: ChangeEvent<HTMLInputElement>): void;
  onSubmit(event: FormEvent<HTMLFormElement>): void;
}

gql`
  query ResolvedAddFriendUserTag($userTag: String!) {
    resolveUserTags(userTags: [$userTag]) {
      userIds {
        key
        value
      }
    }
  }
`;

const SUCCESS_ANIMATION_TIME = 1250;

export function useAddFriendForm(): HookResult {
  const { userId } = useAuthenticatedUser();
  const [userTag, setUserTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Nullable<string>>(null);
  const [success, setSuccess] = useState(false);

  const trimmedUserTag = userTag.trim();

  const [resolveUserTag] = useResolvedAddFriendUserTagLazyQuery();
  const [sendFriendRequest] = useSendFriendRequestMutation({
    onCompleted: () => {
      setLoading(false);
      setSuccess(true);
    },
    onError(error) {
      setLoading(false);

      // @todo: ideally this would be a separate error code so we don't have to check
      // type of error this way
      if (error.message.includes('cannot add self as friend')) {
        setError('You should find some other friends...');
        return;
      }

      if (error.message.includes('already a friend')) {
        setError('You are already friends!');
        return;
      }

      if (error.message.includes('already invited')) {
        setError('Friend request is already sent!');
        return;
      }
      setError('Something went wrong');
    },
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // First find user id for the given userTag
    const { data: resolveUserTagsResult } = await resolveUserTag({
      variables: { userTag },
    });

    if (
      !resolveUserTagsResult?.resolveUserTags?.userIds ||
      resolveUserTagsResult.resolveUserTags.userIds.length === 0
    ) {
      setError('User does not exist');
      setLoading(false);
      return;
    }

    const [firstUserIdResult] = resolveUserTagsResult.resolveUserTags.userIds;
    const friendId = firstUserIdResult.value;

    sendFriendRequest({
      variables: { userId, friendId },
    });
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserTag(event.target.value);
    setError(null);
    setSuccess(false);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (success) {
      timeout = setTimeout(() => {
        setUserTag('');
        setSuccess(false);
      }, SUCCESS_ANIMATION_TIME);
    }

    return () => clearTimeout(timeout);
  }, [success]);

  return { inputValue: trimmedUserTag, success, loading, error, onInputChange, onSubmit };
}
