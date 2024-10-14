import { RefObject, useEffect } from 'react';

type Options = {
  condition?: boolean;
  exempt?: (RefObject<HTMLElement> | 'portals')[];
};

export function useOnOutsideClick(
  ref: RefObject<HTMLElement>,
  callback: (event: MouseEvent) => void,
  options?: Options,
) {
  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      const container = ref.current;

      // First check if the event target is within the exempt list
      if (options?.exempt) {
        const exemptions = options.exempt;

        if (exemptions.includes('portals')) {
          const portals = document.getElementById('portals');
          if (portals?.contains(event.target as Node)) {
            return;
          }
        }

        if (
          exemptions.some(
            (ref) =>
              typeof ref !== 'string' &&
              (ref.current === event.target ||
                ref.current?.contains(event.target as Node)),
          )
        ) {
          return;
        }
      }

      // Lastly, check if the event target is within the base container
      if (event.target === container || container?.contains(event.target as Node)) {
        return;
      }

      callback(event);
    }

    if (options?.condition || typeof options?.condition === 'undefined') {
      document.body.addEventListener('mousedown', onDocumentClick);
    }

    return () => {
      document.body.removeEventListener('mousedown', onDocumentClick);
    };
  }, [callback, options, ref]);
}
