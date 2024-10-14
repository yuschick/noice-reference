import { useId, useRef, useState } from 'react';
import { BiBrush } from 'react-icons/bi';

import styles from './ObjectValueInput.module.css';

import { Button } from '@common/button';
import { Textarea } from '@common/input';

interface Props {
  pattern?: string;
  isArray?: boolean;
  onChange(inputObject: string): void;
}

export function ObjectValueInput({ onChange: onChangeProp, isArray }: Props) {
  const id = useId();
  const [parseError, setParseError] = useState<string>();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const onChange = (input: string) => {
    try {
      setParseError(undefined);

      const object = JSON.parse(input);

      if (typeof object !== 'object') {
        inputRef.current?.setCustomValidity(
          `Value should be object, now it is ${typeof object}`,
        );
        inputRef.current?.reportValidity();
      } else if (isArray && !Array.isArray(object)) {
        inputRef.current?.setCustomValidity('Value should be an array');
        inputRef.current?.reportValidity();
      } else {
        inputRef.current?.setCustomValidity('');
      }

      const inputObject = JSON.stringify(object);
      onChangeProp(inputObject);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setParseError(e.message);
    }
  };

  const onPrettify = () => {
    if (!inputRef.current) {
      return;
    }

    const value = JSON.stringify(JSON.parse(inputRef.current.value), undefined, 2);
    inputRef.current.value = value;
  };

  return (
    <div className={styles.wrapper}>
      <Textarea
        aria-describedby={id}
        className={styles.textarea}
        defaultValue={isArray ? '[]' : '{}'}
        label="New value"
        ref={inputRef}
        rows={5}
        onChange={onChange}
      />

      <span
        className={styles.error}
        id={id}
      >
        {parseError}
      </span>

      <Button
        buttonType="ghost"
        disabled={!!parseError}
        icon={BiBrush}
        text="Prettify"
        onClick={onPrettify}
      />
    </div>
  );
}
