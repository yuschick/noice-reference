import type {
  CSSInputType,
  CalcInputType,
  ConditionalInputType,
  GradientInputType,
  YamlInput,
  YamlValueType,
} from './input-types';
import type {
  CalcOperation,
  CalcValueType,
  ConditionalToken,
  Token,
  TokenGroup,
  TokenValue,
} from './output-types';
import { getStringUnit, isCalcOperation, isNumber, isVarReference } from './utils';

function parseStringValue(value: string): TokenValue<'string'> {
  const unit = getStringUnit(value);

  return {
    str: value,
    unit,
  };
}

function parseVarReference(value: string): TokenValue<'var'> {
  const reference = value.slice(value.indexOf('(') + 1, value.indexOf(')'));
  const [group, varName] = reference.split('.');

  // @todo should add value here maybe?
  return {
    referencedGroup: group,
    referencedVar: varName,
  };
}

function parseCssValue(value: CSSInputType): TokenValue<'css'> {
  return {
    cssString: value.css,
  };
}

function parseCalcValue(value: CalcInputType): TokenValue<'calc'> {
  const parts = value.calc.split(' ');

  const operations: CalcOperation[] = [];
  // @todo -> I have goofed types here
  const values: CalcValueType[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (isCalcOperation(part)) {
      operations.push(part as CalcOperation);
      continue;
    }

    if (isNumber(part)) {
      values.push(Number(part));
      continue;
    }

    if (isVarReference(part)) {
      values.push(parseVarReference(part));
      continue;
    }

    values.push(parseStringValue(part));
  }

  return {
    operations,
    values,
  };
}

function parseGradientValue(value: GradientInputType): TokenValue<'gradient'> {
  return {
    direction: value.direction,
    stops: value.stops.map((stop) => ({
      color: isVarReference(stop.color)
        ? parseVarReference(stop.color)
        : parseStringValue(stop.color),
      position: stop.position,
    })),
  };
}

export function parseVariable(varKey: string, value: YamlValueType): Token {
  // Numbers
  if (isNumber(value)) {
    return {
      name: varKey,
      type: 'number',
      value: Number(value),
    };
  }

  // Complex types
  if (typeof value === 'object') {
    if (typeof value.type === 'undefined') {
      throw new Error(
        `Object variable found without a type: ${varKey} ${JSON.stringify(value)}`,
      );
    }

    let parsedValue: TokenValue<'calc' | 'css' | 'gradient'>;

    switch (value.type) {
      case 'css':
        parsedValue = parseCssValue(value);
        break;
      case 'gradient':
        parsedValue = parseGradientValue(value);
        break;
      case 'calc':
        parsedValue = parseCalcValue(value);
        break;
      default:
        throw new Error(`Invalid variable type found (${varKey})`);
    }

    return {
      name: varKey,
      type: value.type,
      value: parsedValue,
    };
  }

  // Strings
  if (typeof value !== 'string') {
    throw new Error(`Invalid variable type found (${varKey})`);
  }

  if (isVarReference(value)) {
    return {
      name: varKey,
      type: 'var',
      value: parseVarReference(value),
    };
  }

  return {
    name: varKey,
    type: 'string',
    value: parseStringValue(value),
  };
}

export function parseConditional(
  varKey: string,
  value: ConditionalInputType,
): ConditionalToken {
  return {
    name: varKey,
    statement: value.statement,
    value: parseVariable(varKey, value.value),
  };
}

// @todo -> isConditional optional prop and use recursion to parse (since it is an object of groups)
export function parseGroup(
  groupKey: keyof YamlInput,
  context: YamlInput,
  isConditional = false,
): TokenGroup {
  const output: TokenGroup = {
    name: groupKey,
    type: isConditional ? 'conditional' : 'normal',
    children: new Map(),
  };

  const group = context[groupKey];

  for (const varKey of Object.keys(group)) {
    const variable = isConditional
      ? parseConditional(varKey, group[varKey] as unknown as ConditionalInputType) // forgive
      : parseVariable(varKey, group[varKey] as YamlValueType);
    output.children.set(varKey, variable);
  }

  return output;
}
