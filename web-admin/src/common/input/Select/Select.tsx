import { ComponentProps, forwardRef, useState, FocusEvent } from 'react';

import { BaseSelect, BaseSelectProps } from './BaseSelect';

export interface Props
  extends Omit<BaseSelectProps, 'isDirty'>,
    Omit<ComponentProps<'select'>, 'onChange' | 'ref' | 'size'> {
  onChange?(value: string): void;
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  (
    { label, options, onChange, className, onBlur: onBlurProp, hasChanges, ...props },
    ref,
  ) => {
    const [blurred, setBlurred] = useState(false);

    const onBlur = (event: FocusEvent<HTMLSelectElement, Element>) => {
      setBlurred(true);
      onBlurProp?.(event);
    };

    return (
      <BaseSelect
        className={className}
        hasChanges={hasChanges}
        isDirty={blurred}
        label={label}
        options={options}
        ref={ref}
        onBlur={onBlur}
        onChange={(event) => onChange?.(event.target.value)}
        {...props}
      />
    );
  },
);
