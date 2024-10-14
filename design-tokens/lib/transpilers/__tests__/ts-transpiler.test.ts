import { Token, TokenGroup } from '../../parser';
import { tsTranspiler } from '../ts-transpiler';

describe('tsTranspiler', () => {
  describe('startGroup', () => {
    it('should return a comment and initialize a const object', () => {
      expect(tsTranspiler.startGroup('color')).toEqual([
        '',
        '/* color */',
        'export const color = {',
      ]);
    });
  });

  describe('endGroup', () => {
    it('should return a object closure and empty string', () => {
      expect(tsTranspiler.endGroup()).toEqual(['} as const;']);
    });
  });

  describe('transpileVariable', () => {
    const context = new Map();

    it('should return a property for numbers', () => {
      const num = tsTranspiler.transpileVariable(
        'border',
        {
          name: 'radius',
          type: 'number',
          value: 5,
        } as Token<'number'>,
        context,
      );
      expect(num).toEqual('radius: 5,');
    });

    it('should return a property for strings', () => {
      const color = tsTranspiler.transpileVariable(
        'color',
        {
          name: 'primary',
          type: 'string',
          value: {
            str: '#000',
          },
        } as Token<'string'>,
        context,
      );
      const percent = tsTranspiler.transpileVariable(
        'border',
        {
          name: 'radius',
          type: 'string',
          value: {
            str: '5%',
            unit: '%',
          },
        } as Token<'string'>,
        context,
      );

      expect(color).toEqual('primary: `#000`,');
      expect(percent).toEqual('radius: `5%`,');
    });

    it('should camel case the variable name', () => {
      const camelCase = tsTranspiler.transpileVariable(
        'color',
        {
          name: 'primary-color',
          type: 'string',
          value: {
            str: '#000',
          },
        } as Token<'string'>,
        context,
      );
      expect(camelCase).toEqual('primaryColor: `#000`,');

      const longCamelCase = tsTranspiler.transpileVariable(
        'color',
        {
          name: 'red-main-500',
          type: 'string',
          value: {
            str: '#f00',
          },
        } as Token<'string'>,
        context,
      );
      expect(longCamelCase).toEqual('redMain500: `#f00`,');
    });

    it('should return a copy of the value of referenced variables', () => {
      const colorPrimary: Token<'string'> = {
        name: 'primary',
        type: 'string',
        value: {
          str: '#000',
        },
      };
      const colorSecondary: Token<'var'> = {
        name: 'secondary-red-500',
        type: 'var',
        value: {
          referencedGroup: 'color',
          referencedVar: 'primary',
        },
      };
      const borderColor: Token<'var'> = {
        name: 'color',
        type: 'var',
        value: {
          referencedGroup: 'color',
          referencedVar: 'primary',
        },
      };

      const testContext = new Map();
      const testColorGroup = new Map();
      testColorGroup.set('primary', colorPrimary);
      testColorGroup.set('secondary-red-500', colorSecondary);

      const testBorderGroup = new Map();
      testBorderGroup.set('color', borderColor);

      testContext.set('color', {
        name: 'color',
        type: 'normal',
        children: testColorGroup,
      } as TokenGroup);
      testContext.set('border', {
        name: 'border',
        type: 'normal',
        children: testBorderGroup,
      } as TokenGroup);

      const sameGroupReference = tsTranspiler.transpileVariable(
        'color',
        colorSecondary,
        testContext,
      );
      const differentGroupReference = tsTranspiler.transpileVariable(
        'border',
        borderColor,
        testContext,
      );

      expect(sameGroupReference).toEqual(
        `secondaryRed500: \`${colorPrimary.value.str}\`,`,
      );
      expect(differentGroupReference).toEqual(`color: \`${colorPrimary.value.str}\`,`);
    });

    it('should ignore unknown expressions', () => {
      const expression = tsTranspiler.transpileVariable(
        'color',
        {
          name: 'primary',
          type: 'css',
          value: {
            cssString: 'calc(#000 / 2)',
          },
        },
        context,
      );
      expect(expression).toEqual('');
    });
  });
});
