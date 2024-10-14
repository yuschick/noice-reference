import { TokenGroup, Token } from './parser';

export type GroupStartHandler = (groupKey: string) => string[];
export type GroupEndHandler = () => string[];
export type VariableHandler = (
  groupKey: string,
  variable: Token,
  context: TokenConfig,
) => string;

export interface Transpiler {
  startGroup: GroupStartHandler;
  endGroup: GroupEndHandler;
  transpileVariable: VariableHandler;
}

export type TokenConfig = Map<string, TokenGroup<'normal'>>;
export type ConditionalTokenConfig = Map<string, TokenGroup<'conditional'>>;

export type ObjectValues<T> = T[keyof T];
