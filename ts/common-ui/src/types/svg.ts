import { IconType } from 'react-icons';

export type SvgComponent =
  | IconType
  | React.FunctionComponent<React.SVGAttributes<SVGElement>>;
