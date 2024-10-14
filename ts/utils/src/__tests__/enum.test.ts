import { getEnumKeyByEnumValue, getNextStateMapping } from '../enum';

describe('enum utils', () => {
  enum TestEnum {
    Key1 = 'key-1',
  }

  enum MappedEnum {
    State1,
    State2,
    State3,
    State4,
  }

  const EnumMap = {
    [MappedEnum.State1]: MappedEnum.State2,
    [MappedEnum.State2]: MappedEnum.State3,
    [MappedEnum.State3]: MappedEnum.State4,
    [MappedEnum.State4]: MappedEnum.State4,
  };

  describe('getEnumKeyByEnumValue', () => {
    it('should give correct key with valid enum value', () => {
      const key = getEnumKeyByEnumValue(TestEnum, 'key-1');
      expect(key).toEqual('Key1');
    });

    it('should not throw and return null with invalid enum value', () => {
      const key = getEnumKeyByEnumValue(TestEnum, 'INVALID');
      expect(key).toEqual(null);
    });
  });

  describe('getNextStateMapping', () => {
    const isStepValid = (state: MappedEnum) => {
      if (state === MappedEnum.State3) {
        return false;
      }

      return true;
    };

    const result = getNextStateMapping(EnumMap, MappedEnum, isStepValid);
    expect(result).toEqual({
      [MappedEnum.State1]: MappedEnum.State2,
      [MappedEnum.State2]: MappedEnum.State4,
      [MappedEnum.State3]: MappedEnum.State4,
      [MappedEnum.State4]: MappedEnum.State4,
    });
  });
});
