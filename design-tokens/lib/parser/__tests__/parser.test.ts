import { YamlInput } from '../input-types';
import type {
  CalcOperation,
  CalcValueType,
  ConditionalToken,
  GroupType,
  Token,
  TokenGroup,
  TokenTypes,
  TokenValue,
} from '../output-types';
import { parseConditional, parseGroup, parseVariable } from '../parser';

describe('parseVariable', () => {
  describe('Primitive values', () => {
    it('should parse number variables correctly', () => {
      const numToken = parseVariable('test', 50);
      expect(numToken.type).toEqual<TokenTypes>('number');
      expect(numToken.value).toEqual(50);
    });

    it('should parse strings correctly', () => {
      const withUnit = parseVariable('pixels', '100px');
      expect(withUnit.type).toEqual<TokenTypes>('string');
      expect(withUnit.value).toEqual<TokenValue<'string'>>({
        str: '100px',
        unit: 'px',
      });

      const withoutUnit = parseVariable('display-type', 'block');
      expect(withoutUnit.value).toEqual<TokenValue<'string'>>({
        str: 'block',
      });
    });
  });

  describe('Variable Referencing', () => {
    it('should detect and parse variable references correctly', () => {
      const variableRef = parseVariable('secondary', 'var(color.dark-main)');
      expect(variableRef.type).toEqual<TokenTypes>('var');
      expect(variableRef.value).toEqual<TokenValue<'var'>>({
        referencedVar: 'dark-main',
        referencedGroup: 'color',
      });
    });

    it('FIXME: should not parse variable refs correctly with kebab-case groups', () => {
      const variableRef = parseVariable('secondary', 'var(alt-colors-main)');
      // This is what it SHOULD equal. We may need to adjust the separator
      expect(variableRef.value).not.toEqual<TokenValue<'var'>>({
        referencedVar: 'main',
        referencedGroup: 'alt-colors',
      });
    });
  });

  describe('Complex Types', () => {
    it('should parse raw CSS properties correctly', () => {
      const css = `color-mix(in srgb, var(--noi-color-black-main), 0%)`;
      const cssVar = parseVariable('transparent', {
        type: 'css',
        css,
      });
      expect(cssVar.type).toEqual<TokenTypes>('css');
      expect(cssVar.value).toEqual<TokenValue<'css'>>({
        cssString: css,
      });
    });

    it('should parse gradients correctly', () => {
      const gradient = parseVariable('some-gradient', {
        type: 'gradient',
        direction: '90deg',
        stops: [
          {
            position: '0%',
            color: '#ff0', // Normal color...
          },
          {
            position: '100%',
            color: 'var(color.secondary)', // Variable...
          },
        ],
      });
      expect(gradient.type).toEqual<TokenTypes>('gradient');
      expect(gradient.value).toEqual<TokenValue<'gradient'>>({
        direction: '90deg',
        stops: [
          {
            position: '0%',
            color: {
              str: '#ff0',
            },
          },
          {
            position: '100%',
            color: {
              referencedVar: 'secondary',
              referencedGroup: 'color',
            },
          },
        ],
      });
    });

    it('should parse calc correctly', () => {
      const calcDivision = parseVariable('calculated', {
        type: 'calc',
        calc: 'var(layout.min-width) / 50%',
      });
      expect(calcDivision.type).toEqual<TokenTypes>('calc');
      expect(calcDivision.value).toEqual<TokenValue<'calc'>>({
        operations: ['/'],
        values: [
          {
            referencedVar: 'min-width',
            referencedGroup: 'layout',
          },
          {
            str: '50%',
            unit: '%',
          },
        ],
      });

      const calcMultiplication = parseVariable('calculated', {
        type: 'calc',
        calc: '500 * 2px',
      }) as Token<'calc'>;
      expect(calcMultiplication.value.operations).toEqual<CalcOperation[]>(['*']);
      expect(calcMultiplication.value.values).toEqual<CalcValueType[]>([
        500,
        {
          str: '2px',
          unit: 'px',
        },
      ]);

      const calcAddSub = parseVariable('calccalc', {
        type: 'calc',
        calc: '500 + -20 - 100',
      }) as Token<'calc'>;
      expect(calcAddSub.value.operations).toEqual<CalcOperation[]>(['+', '-']);
      expect(calcAddSub.value.values).toEqual<CalcValueType[]>([500, -20, 100]);
    });

    it('should throw if given an invalid object', () => {
      expect(() =>
        parseVariable('invalid', {
          // @ts-expect-error We are doing this on purpose
          type: 'lol wat',
          wrong: true,
          false: 'huh???',
        }),
      ).toThrow();
    });
  });
});

describe('parseConditional', () => {
  it('should include a given statement and parse variables like normal', () => {
    const name = 'conditional-test';
    const statement = '&[dir=rtl]';

    const num = parseConditional(name, {
      statement,
      value: 50,
    });
    expect(num).toEqual<ConditionalToken>({
      name,
      statement,
      value: parseVariable(name, 50),
    });
  });
});

describe('parseGroup', () => {
  const exampleConfig: YamlInput = {
    test: {
      number: 500,
      string: '300px',
      css: {
        type: 'css',
        css: 'content: ""',
      },
    },
    // @ts-expect-error There is something borked with types here but I can't figure it out atm.
    'conditional-values': {
      test: {
        string: {
          value: '200px',
          statement: `@media (min-width: 1000px)`,
        },
      },
    },
  };

  it('should parse all the variables in a given group', () => {
    const group = parseGroup('test', exampleConfig, false) as TokenGroup<'normal'>;
    expect(group.children.size).toEqual(3);
    expect(group.type).toEqual<GroupType>('normal');
    expect(group.children.get('number').type).toEqual<TokenTypes>('number');
    expect(group.children.get('string').type).toEqual<TokenTypes>('string');
    expect(group.children.get('css').type).toEqual<TokenTypes>('css');
  });

  it('should parse all the variables in a given conditional group', () => {
    const group = parseGroup(
      'test',
      exampleConfig['conditional-values'],
      true,
    ) as TokenGroup<'conditional'>;
    expect(group.children.size).toEqual(1);
    expect(group.type).toEqual<GroupType>('conditional');

    const child = group.children.get('string');
    expect(child).toBeDefined();
    expect(child.statement).toBeDefined();
  });
});
