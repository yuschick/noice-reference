import inRange from 'lodash/inRange';
import { useId, useState, FocusEvent } from 'react';

import styles from './SignupBirthday.module.css';

import { InputField } from '@common-components';

interface Props {
  onDayChange(day: number): void;
  onMonthChange(month: number): void;
  onYearChange(year: number): void;
}

export function SignupBirthday({ onDayChange, onMonthChange, onYearChange }: Props) {
  const [isValidDay, setIsValidDay] = useState<boolean>(true);
  const [isValidMonth, setIsValidMonth] = useState<boolean>(true);
  const [isValidYear, setIsValidYear] = useState<boolean>(true);

  const dobErrorId = useId();

  const onDayBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
    const day = parseInt(event.target.value, 10);
    setIsValidDay(inRange(day, 1, 32));
  };

  const onMonthBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
    const month = parseInt(event.target.value, 10);
    setIsValidMonth(inRange(month, 1, 13));
  };

  const onYearBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
    const year = parseInt(event.target.value, 10);
    setIsValidYear(inRange(year, 1900, new Date().getFullYear() + 1));
  };

  return (
    <div className={styles.dateOfBirthWrapper}>
      <div className={styles.dateOfBirthText}>Date of Birth</div>

      <div className={styles.horizontalWrapper}>
        <InputField
          data-testid="signup-birthday-day"
          error={!isValidDay ? { message: 'Enter a valid day of birth' } : undefined}
          inputMode="numeric"
          label="Day"
          max={31}
          maxLength={2}
          min={1}
          minLength={1}
          type="number"
          required
          onBlur={onDayBlur}
          onChange={(event) => onDayChange(parseInt(event.target.value, 10))}
        />

        <InputField
          data-testid="signup-birthday-month"
          error={!isValidMonth ? { message: 'Enter a valid month of birth' } : undefined}
          inputMode="numeric"
          label="Month"
          max={12}
          maxLength={2}
          min={1}
          minLength={1}
          type="number"
          required
          onBlur={onMonthBlur}
          onChange={(event) => onMonthChange(parseInt(event.target.value, 10))}
        />

        <InputField
          data-testid="signup-birthday-year"
          error={!isValidYear ? { message: 'Enter a valid year of birth' } : undefined}
          inputMode="numeric"
          label="Year"
          max={new Date().getFullYear() + 1}
          maxLength={4}
          min={1900}
          minLength={4}
          type="number"
          required
          onBlur={onYearBlur}
          onChange={(event) => onYearChange(parseInt(event.target.value, 10))}
        />
      </div>

      <div
        className={styles.dateOfBirthErrorText}
        id={dobErrorId}
      >
        {(!isValidDay || !isValidMonth || !isValidYear) && (
          <span>Enter valid date of birth</span>
        )}
      </div>
    </div>
  );
}
