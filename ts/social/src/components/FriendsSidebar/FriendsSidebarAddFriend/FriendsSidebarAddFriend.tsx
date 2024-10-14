import { useMountEffect } from '@noice-com/common-react-core';
import { Button, Icon, InputField } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, useId } from 'react';
import { BiCheckCircle } from 'react-icons/bi';

import { useFriendsAnalytics } from '../hooks/useFriendsAnalytics.hook';

import styles from './FriendsSidebarAddFriend.module.css';
import { useAddFriendForm } from './hooks/useAddFriendForm.hook';

export const SUCCESS_ANIMATION_TIME = 1250;

export interface Props {
  className?: string;
  onBackButtonClick(): void;
}

export function FriendsSidebarAddFriend({ className, onBackButtonClick }: Props) {
  const id = useId();
  const { sendAddFriendFormViewedEventCallback } = useFriendsAnalytics();

  const { inputValue, success, loading, error, onInputChange, onSubmit } =
    useAddFriendForm();

  useMountEffect(() => {
    sendAddFriendFormViewedEventCallback();
  });

  return (
    <div className={classNames(className, styles.wrapper)}>
      <div className={styles.backButtonWrapper}>
        <Button
          level="secondary"
          size="sm"
          onClick={onBackButtonClick}
        >
          Back to friends list
        </Button>
      </div>

      <hr className={styles.divider} />

      <form
        className={styles.form}
        style={
          {
            '--add-friend-complete-animation-time': `${SUCCESS_ANIMATION_TIME}ms`,
          } as CSSProperties
        }
        onSubmit={onSubmit}
      >
        <h2 className={styles.title}>Add your friend on Noice</h2>

        <p className={styles.description}>
          You can add a friend with their Noice username.
        </p>

        <div className={styles.inputWrapper}>
          <InputField
            data-ftue-anchor="add-friend-input"
            error={error ? { message: 'An error ocurred.' } : undefined}
            label="Enter a username"
            name="userName"
            size="lg"
            value={inputValue}
            onChange={onInputChange}
          />

          <span
            className={styles.errorLabel}
            id={id}
          >
            {error}
          </span>

          {success && (
            <Icon
              className={styles.completeIcon}
              icon={BiCheckCircle}
            />
          )}
        </div>

        <Button
          isDisabled={!inputValue}
          isLoading={loading}
          size="sm"
          type="submit"
          variant="cta"
        >
          Send friend request
        </Button>
      </form>
    </div>
  );
}
