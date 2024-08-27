import { useMediaQuery } from '@common-hooks';
import { WithChildren } from '@common-types';

export interface Props {
  query: string;
}

export function Breakpoint({ query, children }: WithChildren<Props>) {
  const matches = useMediaQuery(query);

  if (!matches) {
    return null;
  }

  return <>{children}</>;
}
