import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function getAllFields(search: string): SearchField<string | number | boolean>[] {
  const searches = search.slice(1).split('&');

  if (searches.length === 1 && searches[0] === '') {
    return [];
  }

  return searches.map((search) => {
    const [field, value] = search.split('=');

    if (!value || value === 'true') {
      return { field, value: true };
    }

    const parsedNum = Number(value);

    if (!isNaN(parsedNum)) {
      return { field, value: parsedNum };
    }

    if (value === 'false') {
      return { field, value: false };
    }

    return { field, value };
  });
}

interface SearchField<T = string | number | boolean> {
  field: string;
  value: T;
}

export function useURLSearch(): [SearchField[], <T>(search: string) => T | undefined] {
  const location = useLocation();
  const [fields, setFields] = useState<SearchField<string | number | boolean>[]>(
    getAllFields(location.search),
  );

  useEffect(() => {
    setFields(getAllFields(location.search));
  }, [location]);

  const getSearchField = useCallback(
    <T>(search: string) => {
      const field = fields.find((f) => f.field === search);

      if (field) {
        return field.value as unknown as T;
      }
    },
    [fields],
  );

  return [fields, getSearchField];
}
