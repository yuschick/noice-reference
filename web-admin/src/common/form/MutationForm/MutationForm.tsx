import * as Apollo from '@apollo/client';
import { WithChildren } from '@noice-com/common-ui';
import classNames from 'classnames';
import { FormEvent } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';

import { Button } from '../../button';

import styles from './MutationForm.module.css';

interface Props<TMutation, TMutationVariables> extends WithChildren {
  className?: string;
  isLoading?: boolean;
  submitText?: string;
  useCustomSubmitButton?: boolean;
  mutationFn: Apollo.MutationFunction<TMutation, TMutationVariables>;
  transformVariables?(variables: TMutationVariables): TMutationVariables;
  onReset?(): void;
  onSubmit?(): void;
}

export function MutationForm<TMutation, TMutationVariables extends FieldValues>({
  children,
  className,
  isLoading,
  submitText,
  mutationFn,
  useCustomSubmitButton,
  transformVariables,
  onReset: onResetProp,
  onSubmit: onSubmitProp,
}: Props<TMutation, TMutationVariables>) {
  const { handleSubmit, reset } = useFormContext<TMutationVariables>();

  const onSubmit = (variables: TMutationVariables) => {
    onSubmitProp?.();

    mutationFn({
      variables: transformVariables ? transformVariables(variables) : variables,
    });
  };

  const onReset = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    reset();
    onResetProp?.();
  };

  return (
    <form
      className={classNames(styles.form, className)}
      onReset={onReset}
      onSubmit={handleSubmit(onSubmit)}
    >
      {children}

      {!useCustomSubmitButton && (
        <>
          <div>
            <Button
              aria-busy={isLoading}
              buttonType="success"
              disabled={isLoading}
              text={submitText ?? 'Save'}
              type="submit"
            />
          </div>
        </>
      )}
    </form>
  );
}
