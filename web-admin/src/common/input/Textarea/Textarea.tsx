import { forwardRef, useState, FocusEvent, ComponentProps } from 'react';

import { BaseTextarea, BaseTextareaProps } from './BaseTextarea';

export interface Props
  extends Omit<BaseTextareaProps, 'isDirty'>,
    Omit<ComponentProps<'textarea'>, 'onChange' | 'ref' | 'className' | 'value'> {
  onChange?(value: string): void;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, onChange, className, onBlur: onBlurProp, hasChanges, ...props }, ref) => {
    const [blurred, setBlurred] = useState(false);

    const onBlur = (event: FocusEvent<HTMLTextAreaElement, Element>) => {
      setBlurred(true);
      onBlurProp?.(event);
    };

    return (
      <BaseTextarea
        className={className}
        hasChanges={hasChanges}
        isDirty={blurred}
        label={label}
        ref={ref}
        onBlur={onBlur}
        onChange={(event) => onChange?.(event.target.value)}
        {...props}
      />
    );
  },
);
