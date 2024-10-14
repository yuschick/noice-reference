import { isVarReference, getStringUnit, isCalcOperation, isNumber } from '../utils';

describe('isVarReference', () => {
  it('should return true if the value is a var reference', () => {
    expect(isVarReference('var(group-variable)')).toBe(true);
  });

  it('should return false if the value is not a var reference', () => {
    expect(isVarReference('--foo')).toBe(false);
  });
});

describe('isNumber', () => {
  it('should return true if the value is a number', () => {
    expect(isNumber(10)).toBe(true);
    expect(isNumber('not')).toBe(false);
  });
});

describe('getStringUnit', () => {
  it('should return the unit of a string value', () => {
    expect(getStringUnit('10px')).toBe('px');
    expect(getStringUnit('10em')).toBe('em');
    expect(getStringUnit('10rem')).toBe('rem');
    expect(getStringUnit('10vh')).toBe('vh');
    expect(getStringUnit('10vw')).toBe('vw');
    expect(getStringUnit('10vmin')).toBe('vmin');
    expect(getStringUnit('10vmax')).toBe('vmax');
    expect(getStringUnit('10%')).toBe('%');
  });

  it('should return undefined if the value does not have a unit', () => {
    expect(getStringUnit('10')).toBe(undefined);
    expect(getStringUnit('var(--foo)')).toBe(undefined);
  });
});

describe('isCalcOperation', () => {
  it('should return true if the value is a calc operation', () => {
    expect(isCalcOperation('+')).toBe(true);
    expect(isCalcOperation('-')).toBe(true);
    expect(isCalcOperation('*')).toBe(true);
    expect(isCalcOperation('/')).toBe(true);
  });

  it('should return false if the value is not a calc operation', () => {
    expect(isCalcOperation('10')).toBe(false);
    expect(isCalcOperation('var(--foo)')).toBe(false);
  });
});
