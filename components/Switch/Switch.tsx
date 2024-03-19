import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react';

import { InteractiveInputDescription } from '../InteractiveInputDescription';
import { InteractiveInputLabel } from '../InteractiveInputLabel';

import styles from './Switch.module.css';

import { useMouseClickWithSound, useMouseEnterWithSound } from '@common-hooks';

interface Props
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'className' | 'id' | 'role' | 'style' | 'type'
  > {
  isLoading?: boolean;
  label: string | ReactNode;
  description?: string;
  labelType?: 'hidden' | 'visible';
}

export const Switch = forwardRef<HTMLInputElement, Props>(function Switch(
  {
    checked,
    defaultChecked,
    disabled,
    isLoading,
    label,
    labelType = 'visible',
    description,
    onClick,
    onMouseEnter,
    ...htmlAttributes
  },
  externalRef,
) {
  const handleMouseEnterWithSound = useMouseEnterWithSound(onMouseEnter);
  const handleClickWithSound = useMouseClickWithSound(onClick);

  const descriptionId = useId();

  const showLabel = labelType !== 'hidden';
  const showDescription = !!description && showLabel;

  return (
    <div className={styles.switchRoot}>
      <label className={styles.labelWrapper}>
        <div className={styles.switchWrapper}>
          <input
            {...htmlAttributes}
            aria-busy={isLoading ? 'true' : 'false'}
            aria-describedby={showDescription ? descriptionId : undefined}
            checked={checked}
            className={styles.switch}
            defaultChecked={defaultChecked}
            disabled={disabled || isLoading}
            ref={externalRef}
            role="switch"
            type="checkbox"
            {...(isLoading ? {} : { onClick: handleClickWithSound })}
            {...(isLoading ? {} : { onMouseEnter: handleMouseEnterWithSound })}
          />

          <div className={styles.switchTrack}>
            <div className={styles.switchTrackHandle}>
              <div className={styles.switchTrackHandleLoadingWrapper}>
                <div className={styles.switchTrackHandleLoading} />
              </div>
            </div>
          </div>
        </div>

        <InteractiveInputLabel
          isDisabled={disabled}
          label={label}
          showLabel={showLabel}
        />
      </label>

      {showDescription && (
        <div className={styles.descriptionWrapper}>
          <InteractiveInputDescription
            description={description}
            id={descriptionId}
          />
        </div>
      )}
    </div>
  );
});
