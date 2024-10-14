import { PercentileCalculator } from '../percentile';

describe('percentile calculator', () => {
  const calculator = new PercentileCalculator(1, 1, 100);

  it('should add values and return it for all percentiles', () => {
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((value) => {
      calculator.add(value);
    });

    expect(calculator.percentile(0.5)).toBe(5);
    expect(calculator.percentile(0.7)).toBe(7);
    expect(calculator.percentile(0.8)).toBe(8);
    expect(calculator.percentile(0.9)).toBe(9);
  });
});
