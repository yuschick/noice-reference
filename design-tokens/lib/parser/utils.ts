import type { YamlValueType } from './input-types';
import {
  CalcOperation,
  CalcValueType,
  StringValue,
  VarReferenceValue,
} from './output-types';

export function isVarReference(value: string): boolean {
  return value.indexOf('var(') > -1;
}

export function isNumber(value: YamlValueType): value is number {
  return typeof value === 'number' || !isNaN(Number(value));
}

export function getStringUnit(value: string): string | undefined {
  const unitMatch = value.match(/(\d+)(px|em|rem|vh|vw|vmin|vmax|%|ms)$/);
  if (!unitMatch) {
    return;
  }

  return unitMatch[2];
}

export function removeUnitFromStr(value: string): string {
  const unit = getStringUnit(value);
  if (!unit) {
    return value;
  }

  return value.replaceAll(unit, '');
}

export function isCalcOperation(value: string): value is CalcOperation {
  return ['+', '-', '*', '/'].includes(value);
}

export const isComplexCalcValue = <T extends Exclude<CalcValueType, number>>(
  value: CalcValueType,
): value is T => typeof value === 'object';

export const isVarReferenceValue = (
  value: StringValue | VarReferenceValue,
): value is VarReferenceValue => Object.hasOwn(value, 'referencedVar');
