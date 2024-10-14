import { PlatformRole } from '@noice-com/schemas/auth/auth.pb';
import { FormEvent, useMemo, useRef } from 'react';

import styles from './AddRoleConditionForm.module.css';

import { Button } from '@common/button';
import { Select } from '@common/input';

interface Props {
  excludeOptions?: string[];
  onSubmit(value: string): void;
  onReset(): void;
}

export function AddRoleConditionForm({
  onSubmit: onSubmitProp,
  onReset,
  excludeOptions,
}: Props) {
  const selectRef = useRef<HTMLSelectElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectRef.current) {
      return;
    }

    onSubmitProp(selectRef.current.value);
  };

  const roles = useMemo(() => {
    let roles = Object.values(PlatformRole);

    // filter unspecified role
    roles = roles.filter((role) => role !== PlatformRole.PLATFORM_ROLE_UNSPECIFIED);

    let cleanedRoles = roles.map((role) =>
      role.replace('PLATFORM_ROLE_', '').toLowerCase(),
    );

    // add magic implicit account role
    cleanedRoles.push('$implicit_account');

    cleanedRoles = cleanedRoles.filter((role) => !excludeOptions?.includes(role));

    return cleanedRoles;
  }, [excludeOptions]);

  return (
    <form
      className={styles.form}
      onReset={onReset}
      onSubmit={onSubmit}
    >
      <Select
        className={styles.select}
        label="Role"
        options={roles}
        ref={selectRef}
        preventNoValueOption
        required
      />

      <Button
        text="Add"
        type="submit"
      />

      <Button
        buttonType="ghost"
        text="Cancel"
        type="reset"
      />
    </form>
  );
}
