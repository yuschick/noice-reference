import { forwardRef, useState, FocusEvent, ComponentProps } from 'react';

import { BaseTextField, BaseTextFieldProps } from './BaseTextField';

export interface Props
  extends Omit<BaseTextFieldProps, 'isDirty'>,
    Omit<ComponentProps<'input'>, 'onChange' | 'ref' | 'type' | 'size'> {
  onChange?(value: string): void;
}

export const TextField = forwardRef<HTMLInputElement, Props>(
  ({ label, onChange, type, hasChanges, onBlur: onBlurProp, size, ...props }, ref) => {
    const [blurred, setBlurred] = useState(false);

    const onBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
      setBlurred(true);
      onBlurProp?.(event);
    };

    return (
      <BaseTextField
        hasChanges={hasChanges}
        isDirty={blurred}
        label={label}
        ref={ref}
        size={size}
        type={type}
        onBlur={onBlur}
        onChange={(event) => onChange?.(event.target.value)}
        {...props}
      />
    );
  },
);
