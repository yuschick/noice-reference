import { Nullable } from '@noice-com/utils';
import { ComponentProps, forwardRef } from 'react';

import { UsernameError } from '../types';
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from '../utils';

import { useUsernameOnChangeValidation } from './hooks/useUsernameOnChangeValidation.hook';

import { Button, Callout, InputField } from '@common-components';
import { NoiceSupportLinks } from '@common-types';

interface Props
  extends Omit<
    ComponentProps<typeof InputField>,
    'minLength' | 'maxLength' | 'required' | 'type' | 'onChange' | 'error'
  > {
  usernameError: Nullable<UsernameError>;
  onUsernameChange(username: string): void;
}

export const UsernameInputField = forwardRef<HTMLInputElement, Props>(
  function UsernameInputField({ onUsernameChange, usernameError, ...props }, ref) {
    const { onChange, usernameErrorMessage, showReservedUsernameCallout } =
      useUsernameOnChangeValidation({
        onUsernameChange,
        usernameError,
      });

    return (
      <>
        <InputField
          {...props}
          autoComplete="off"
          error={
            usernameErrorMessage
              ? { message: usernameErrorMessage, type: 'visible' }
              : undefined
          }
          maxLength={USERNAME_MAX_LENGTH}
          minLength={USERNAME_MIN_LENGTH}
          ref={ref}
          type="text"
          required
          onChange={onChange}
        />

        {showReservedUsernameCallout && (
          <Callout
            message="Please contact support with a link to your channel, if you want to claim it."
            slots={{
              actions: {
                primary: (
                  <Button
                    fit="content"
                    size="xs"
                    theme="dark"
                    onClick={() => {
                      window.open(NoiceSupportLinks.Guides, '_blank');
                    }}
                  >
                    Contact
                  </Button>
                ),
              },
            }}
            theme="blue"
            type="warning"
          />
        )}
      </>
    );
  },
);
