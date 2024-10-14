export type PrimitiveInputType = string | number;

export interface CSSInputType {
  type: 'css';
  css: string;
}

export interface GradientInputType {
  type: 'gradient';
  direction: string;
  stops: {
    color: string;
    position: string;
  }[];
}

export interface CalcInputType {
  type: 'calc';
  calc: string;
}

export type YamlValueType =
  | PrimitiveInputType
  | CalcInputType
  | GradientInputType
  | CSSInputType;

export interface ConditionalInputType {
  value: YamlValueType;
  statement: string;
}

export type YamlConditionalInputGroup = Record<string, ConditionalInputType>;

export type YamlInputGroup = Record<string, YamlValueType>;

type KeyOmit<T, U extends keyof any> = T & { [P in U]?: never };
type YamlObject = Record<string, YamlInputGroup>;
export type YamlInput = KeyOmit<YamlObject, 'conditional-values'> & {
  'conditional-values'?: Record<string, YamlConditionalInputGroup>;
};
