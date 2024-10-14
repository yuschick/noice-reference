import type { Token } from '../../parser';
import { cssTranspiler } from '../css-transpiler';

describe('cssTranspiler', () => {
  describe('startGroup', () => {
    it('should return a comment with the group name', () => {
      expect(cssTranspiler.startGroup('color')).toEqual(['/* color */']);
    });
  });

  describe('endGroup', () => {
    it('should return a single empty string', () => {
      expect(cssTranspiler.endGroup()).toEqual(['']);
    });
  });

  describe('transpileVariable', () => {
    const context = new Map();

    it('should return a valid css variable for numbers', () => {
      const num = cssTranspiler.transpileVariable(
        'border',
        {
          name: 'radius',
          type: 'number',
          value: 5,
        } as Token<'number'>,
        context,
      );
      expect(num).toEqual('--noi-border-radius: 5;');
    });

    it('should return a valid css variable for string-like values', () => {
      const color = cssTranspiler.transpileVariable(
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
      const rem = cssTranspiler.transpileVariable(
        'border',
        {
          name: 'radius',
          type: 'string',
          value: {
            str: '5rem',
            unit: 'rem',
          },
        } as Token<'string'>,
        context,
      );
      const percent = cssTranspiler.transpileVariable(
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

      expect(color).toEqual('--noi-color-primary: #000;');
      expect(rem).toEqual('--noi-border-radius: 5rem;');
      expect(percent).toEqual('--noi-border-radius: 5%;');
    });

    it('should return a valid css variable for variables', () => {
      const variable = cssTranspiler.transpileVariable(
        'color',
        {
          name: 'primary',
          type: 'var',
          value: {
            referencedGroup: 'color',
            referencedVar: 'secondary',
          },
        } as Token<'var'>,
        context,
      );
      expect(variable).toEqual('--noi-color-primary: var(--noi-color-secondary);');
    });
  });
});
