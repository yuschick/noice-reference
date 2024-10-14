import { Nullable } from '@noice-com/utils';
import { useCallback, useRef, useState } from 'react';

export function useUniqueValueArray<T>(
  maxLength?: number,
): [
  Nullable<T[]>,
  (value: T) => Nullable<T[]>,
  (values: Nullable<T[]>) => Nullable<T[]>,
] {
  const [values, setValues] = useState<Nullable<T[]>>(null);
  const valuesRef = useRef<Nullable<T[]>>(null);

  const addValue = useCallback(
    (value: T) => {
      let newValues: T[] = [];

      if (valuesRef.current) {
        newValues = [...valuesRef.current];
      }

      if (newValues.includes(value)) {
        return valuesRef.current;
      }

      newValues.push(value);

      if (maxLength && newValues.length > maxLength) {
        newValues.splice(0, newValues.length - maxLength);
      }

      valuesRef.current = newValues;
      setValues(newValues);
      return newValues;
    },
    [maxLength],
  );

  const setContent = useCallback(
    (values: Nullable<T[]>) => {
      let newValues: T[] = [];

      if (values) {
        newValues = values.filter((value) => !newValues.includes(value));
      }

      if (values && maxLength && values.length > maxLength) {
        values.splice(maxLength);
      }

      valuesRef.current = values ? newValues : null;
      setValues(values ? newValues : null);
      return values;
    },
    [maxLength],
  );

  return [values, addValue, setContent];
}
