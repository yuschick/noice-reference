import { Token, TokenValue, isComplexCalcValue, isVarReferenceValue } from '../parser';
import type { TokenConfig, Transpiler } from '../types';

const transpileNumber = (value: TokenValue<'number' | 'string'>) => `${value}`;

const transpileString = (value: TokenValue<'string'>) => `${value.str}`;

const transpileVarRef = (value: TokenValue<'var'>) =>
  `var(--noi-${value.referencedGroup}-${value.referencedVar})`;

const transpileCalc = (value: TokenValue<'calc'>) => {
  const { values, operations } = value;
  const valueLen = values.length;
  const opLen = operations.length;
  const inputDiff = valueLen - opLen;

  if (inputDiff !== 1) {
    const reason = inputDiff > 1 ? 'Too little operations' : 'Too many operations';
    throw new Error(`Cannot transpile calc: ${reason}`);
  }

  let outputStr = `calc(`;
  for (let i = 0; i < valueLen; i++) {
    const param = values[i];
    const suffix = i < opLen ? ` ${operations[i]} ` : ``;

    if (!isComplexCalcValue(param)) {
      outputStr += `${param}${suffix}`;
      continue;
    }

    if (isVarReferenceValue(param)) {
      outputStr += `${transpileVarRef(param)}${suffix}`;
      continue;
    }

    outputStr += `${param.str}${suffix}`;
  }

  return outputStr + `)`;
};

const transpileCss = ({ cssString }: TokenValue<'css'>) => {
  // @todo Would be nice to maintain new lines and tabs, but something to add later
  return cssString.trim().replaceAll('\n', ' ');
};

const transpileGradient = ({ direction, stops }: TokenValue<'gradient'>) => {
  let outputStr = `${direction.trim()}`;

  for (let i = 0; i < stops.length; i++) {
    const { color, position } = stops[i];

    if (isVarReferenceValue(color)) {
      outputStr += `, ${transpileVarRef(color)} ${position}`;
      continue;
    }

    outputStr += `, ${color} ${position}`;
  }

  // @todo Would be nice to maintain new lines and tabs, but something to add later
  // @todo Support for other types of gradients would also be nice (radial, conic, etc.)
  return `linear-gradient(${outputStr})`;
};

class CssTranspiler implements Transpiler {
  public startGroup(groupKey: string) {
    return [`/* ${groupKey} */`];
  }

  public endGroup() {
    return ['']; // Just a new line between groups
  }

  public transpileVariable(groupKey: string, variable: Token, _context: TokenConfig) {
    const { name, value } = variable;
    const prefix = `--noi-${groupKey}-${name}`;

    switch (variable.type) {
      case 'number':
      default:
        return `${prefix}: ${transpileNumber(value as TokenValue<'string' | 'number'>)};`;

      case 'string':
        return `${prefix}: ${transpileString(value as TokenValue<'string'>)};`;

      case 'var':
        return `${prefix}: ${transpileVarRef(value as TokenValue<'var'>)};`;

      case 'calc':
        return `${prefix}: ${transpileCalc(value as TokenValue<'calc'>)};`;

      case 'css':
        return `${prefix}: ${transpileCss(value as TokenValue<'css'>)};`;

      case 'gradient':
        return `${prefix}: ${transpileGradient(value as TokenValue<'gradient'>)};`;
    }
  }
}

export const cssTranspiler = new CssTranspiler();
