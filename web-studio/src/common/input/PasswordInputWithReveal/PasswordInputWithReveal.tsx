import { useToggle, InputFieldProps, InputField, Button } from '@noice-com/common-ui';

import styles from './PasswordInputWithReveal.module.css';

interface Props extends InputFieldProps {
  preventRevealPassword?: boolean;
}

export function PasswordInputWithReveal({
  preventRevealPassword,
  ...inputFieldProps
}: Props) {
  const [showPassword, toggleShowPassword] = useToggle(false);

  const showPasswordLabel = showPassword ? 'Hide' : 'Show';

  return (
    <div className={styles.passwordInputRoot}>
      <InputField
        {...inputFieldProps}
        type={showPassword ? 'text' : 'password'}
      />

      {!preventRevealPassword && (
        <div className={styles.passwordInputRevealButtonWrapper}>
          <Button
            fit="content"
            level="secondary"
            size="xs"
            title={showPasswordLabel}
            onClick={toggleShowPassword}
          >
            {showPasswordLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
