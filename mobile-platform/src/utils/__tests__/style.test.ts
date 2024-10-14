import { createStylesWithVariants } from '../style';

describe('Create styles with variants', () => {
  const defaultStyles = {
    container: {
      width: 50,
      height: 50,
    },
    avatar: {
      borderRadius: 50,
    },
  };
  const largeStyles = {
    container: {
      width: 100,
    },
  };

  const smallStyles = {
    container: {
      width: 50,
    },
  };

  const getStyleSheet = createStylesWithVariants(defaultStyles, {
    large: largeStyles,
    small: smallStyles,
  });

  it('It should return default values', () => {
    expect(getStyleSheet('default')).toBe(defaultStyles);
  });

  it('It should return default values for invalid key', () => {
    // @ts-ignore
    expect(getStyleSheet('someinvalidkey')).toBe(defaultStyles);
  });

  it('It should return large width value', () => {
    expect(getStyleSheet('large').container.width).toBe(largeStyles.container.width);
  });

  it('It should return small width value', () => {
    expect(getStyleSheet('small').container.width).toBe(smallStyles.container.width);
  });
});
