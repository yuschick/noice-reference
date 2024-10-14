export interface StringValue {
  str: string;
  unit?: string;
}

export interface VarReferenceValue {
  referencedGroup: string;
  referencedVar: string;
}

export interface CssValue {
  cssString: string;
}

export interface GradientValue {
  direction: string;
  stops: {
    color: StringValue | VarReferenceValue;
    position: string;
  }[];
}

export type CalcOperation = '+' | '-' | '*' | '/';
export type CalcValueType = StringValue | number | VarReferenceValue;
export interface CalcValue {
  operations: CalcOperation[];
  values: CalcValueType[];
}

interface TokenMap {
  string: StringValue;
  number: number;
  var: VarReferenceValue;
  css: CssValue;
  gradient: GradientValue;
  calc: CalcValue;
}

export type TokenTypes = keyof TokenMap;
export type TokenValue<TType extends TokenTypes = TokenTypes> = TokenMap[TType];

export interface Token<TType extends TokenTypes = TokenTypes> {
  name: string;
  type: TType;
  value: TokenMap[TType];
}

export interface ConditionalToken<TType extends TokenTypes = TokenTypes> {
  name: string;
  statement: string;
  value: Token<TType>;
}

interface GroupMap {
  normal: Token;
  conditional: ConditionalToken;
}

export type GroupType = keyof GroupMap;

export interface TokenGroup<TType extends GroupType = GroupType> {
  name: string;
  type: TType;
  children: Map<string, GroupMap[TType]>;
}
