import { Token, TokenValue } from '../parser';
import { removeUnitFromStr } from '../parser/utils';
import type { TokenConfig, Transpiler } from '../types';
import { convertToCamelCase } from '../utils/text';

const hasDisallowedUnit = (unit: string) => {
  return (
    unit === 'vh' || unit === 'vw' || unit === 'vmin' || unit === 'vmax' || unit === 'ms'
  );
};

const convertAnyNumbersToLetters = (prefix: string) => {
  if (prefix.length < 2) {
    return;
  }

  const prefixNumber = Number(prefix[0]);
  if (!isNaN(prefixNumber)) {
    const prefixLetters = prefix[1].repeat(prefixNumber - 1);

    return `${prefixLetters}${prefix.slice(1, prefix.length)}`;
  }

  return prefix;
};

const transpileNumber = (value: TokenValue<'number'>) => `${value}`;

const transpileString = ({ str, unit }: TokenValue<'string'>) => {
  if (str.indexOf('getRem') > -1) {
    const withoutRem = str.slice(str.indexOf('(') + 1, str.indexOf(')'));

    return withoutRem;
  }

  if (!unit || unit === '%') {
    return `\`${str}\``;
  }

  if (hasDisallowedUnit(unit)) {
    return '';
  }

  const withoutUnit = removeUnitFromStr(str);

  if (unit === 'px') {
    return `\`${withoutUnit}\``;
  }

  // Only have em's and rems left
  const asNumber = Number(withoutUnit);

  return `${asNumber * 16}`; // this should be configured somewhere.
};

const transpileVarRef = (value: TokenValue<'var'>, tree: TokenConfig) => {
  const refGroup = tree.get(value.referencedGroup);
  const refVar = refGroup?.children?.get(value.referencedVar);

  if (!refGroup || !refVar) {
    return '';
  }

  // I really don't like having to duplicate this, but it's fine for now.
  // Would prefer not doing this tho.
  switch (refVar.type) {
    case 'number':
      return transpileNumber(refVar.value as TokenValue<'number'>);
    case 'string':
      return transpileString(refVar.value as TokenValue<'string'>);
    case 'var':
      return transpileVarRef(refVar.value as TokenValue<'var'>, tree);
    default:
      return '';
  }
};

class TsTranspiler implements Transpiler {
  // Group handling
  public startGroup(groupKey: string) {
    return ['', `/* ${groupKey} */`, `export const ${convertToCamelCase(groupKey)} = {`];
  }

  public endGroup() {
    return ['} as const;'];
  }

  // Variable handling
  public transpileVariable(_groupKey: string, variable: Token, context: TokenConfig) {
    const { name, value } = variable;

    const prefix = `${convertAnyNumbersToLetters(convertToCamelCase(name))}`;
    let transpiledValue = '';

    switch (variable.type) {
      case 'number':
        transpiledValue = transpileNumber(value as TokenValue<'number'>);
        break;
      case 'string':
        transpiledValue = transpileString(value as TokenValue<'string'>);
        break;
      case 'var':
        transpiledValue = transpileVarRef(value as TokenValue<'var'>, context);
        break;
      // @todo: calc.
      default:
        break;
    }

    if (transpiledValue !== '') {
      return `${prefix}: ${transpiledValue},`;
    }
    return '';
  }
}

export const tsTranspiler = new TsTranspiler();
