import { useCallback, useRef } from 'react';

import { useSignup } from '../../context';
import { SignupProcessData } from '../../types';
import {
  SIGNUP_DISABLED_LOCALSTORAGE_KEY,
  isSignupDisabledByBirthDate,
} from '../../utils';

interface HookResult {
  onDayChange(day: number): void;
  onMonthChange(month: number): void;
  onYearChange(year: number): void;
  onSubmitBirthdayValidation(): boolean;
}

export function useBirthdayChangeAndValidation(): HookResult {
  const birthday = useRef<Partial<SignupProcessData['dob']>>({});

  const {
    appendSignupData,
    signupData: { dob },
    showError,
  } = useSignup();

  const handleChangedBirthday = (birthday: Partial<SignupProcessData['dob']>) => {
    const { day, month, year } = birthday ?? {};

    if (!day || !month || !year) {
      appendSignupData({ dob: undefined });
      return;
    }

    appendSignupData({ dob: { day, month, year } });
  };

  const onDayChange = (day: number) => {
    birthday.current = { ...birthday.current, day };
    handleChangedBirthday(birthday.current);
  };

  const onMonthChange = (month: number) => {
    birthday.current = { ...birthday.current, month };
    handleChangedBirthday(birthday.current);
  };

  const onYearChange = (year: number) => {
    birthday.current = { ...birthday.current, year };
    handleChangedBirthday(birthday.current);
  };

  const onSubmitBirthdayValidation = useCallback(() => {
    const { day, month, year } = dob || {};

    if (!day || !month || !year) {
      return false;
    }

    if (!isSignupDisabledByBirthDate(day, month, year)) {
      return true;
    }

    const currentDate = new Date();
    const dayInMs = 1000 * 60 * 60 * 24;
    localStorage.setItem(
      SIGNUP_DISABLED_LOCALSTORAGE_KEY,
      `${currentDate.getTime() + dayInMs}`,
    );

    showError({
      header: 'Age verification',
      message: "Our age policy doesn't allow you to sign-up",
      hideBackButton: true,
    });
    return false;
  }, [dob, showError]);

  return {
    onDayChange,
    onMonthChange,
    onYearChange,
    onSubmitBirthdayValidation,
  };
}
