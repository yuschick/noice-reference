import { UsernameStatus } from '@noice-com/schemas/profile/profile.pb';
import { act, renderHook } from '@testing-library/react';
import { ChangeEvent } from 'react';

import { useUsernameOnChangeValidation } from '../useUsernameOnChangeValidation.hook';

const mockOnUsernameChange = jest.fn();

describe('useUsernameOnChangeValidation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error message when username is too short', async () => {
    const { result } = renderHook(() =>
      useUsernameOnChangeValidation({
        onUsernameChange: mockOnUsernameChange,
        usernameError: null,
      }),
    );

    act(() => {
      result.current.onChange({
        target: { value: 'ab' },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.usernameErrorMessage).toBe(
      'Usernames must be between 3 and 30 characters',
    );
    expect(result.current.showReservedUsernameCallout).toBe(false);
    expect(mockOnUsernameChange).toHaveBeenCalledWith('ab');
  });

  it('returns error message when username does not match pattern', async () => {
    const { result } = renderHook(() =>
      useUsernameOnChangeValidation({
        onUsernameChange: mockOnUsernameChange,
        usernameError: null,
      }),
    );

    act(() => {
      result.current.onChange({
        target: { value: 'ab!' },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.usernameErrorMessage).toBe(
      'Username can only contain letters, numbers and underscores',
    );
    expect(result.current.showReservedUsernameCallout).toBe(false);
    expect(mockOnUsernameChange).toHaveBeenCalledWith('ab!');
  });

  it('returns no error message when username is valid', async () => {
    const { result } = renderHook(() =>
      useUsernameOnChangeValidation({
        onUsernameChange: mockOnUsernameChange,
        usernameError: null,
      }),
    );

    act(() => {
      result.current.onChange({
        target: { value: 'abc' },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.usernameErrorMessage).toBe(null);
    expect(result.current.showReservedUsernameCallout).toBe(false);
    expect(mockOnUsernameChange).toHaveBeenCalledWith('abc');
  });

  it('returns error message from the prop', () => {
    const { result } = renderHook(() =>
      useUsernameOnChangeValidation({
        onUsernameChange: mockOnUsernameChange,
        usernameError: UsernameStatus.USERNAME_STATUS_RESERVED,
      }),
    );

    expect(result.current.usernameErrorMessage).toBe('This username has been reserved');
    expect(result.current.showReservedUsernameCallout).toBe(true);
  });
});
