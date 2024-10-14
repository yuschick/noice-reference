import { useEffect, useState } from 'react';

/**
 *
 * This is a custom hook that returns a boolean value based on the media query passed to it.
 *
 * Inspiration: https://fireship.io/snippets/use-media-query-hook/
 * @param query query in string format e.g. '(min-width: 768px)'
 * @returns true if the media query matches, false otherwise
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const matchQueryList = window.matchMedia(query);

    function handleChange(e: MediaQueryListEvent) {
      setMatches(e.matches);
    }

    matchQueryList.addEventListener('change', handleChange);
    return () => {
      matchQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
