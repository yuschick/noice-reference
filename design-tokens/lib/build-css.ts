import { cssTranspiler } from './transpilers/css-transpiler';
import { ConditionalTokenConfig, TokenConfig } from './types';
import { FileBuilder } from './utils/file-builder';

export const buildCss = (
  tree: TokenConfig,
  conditionals: ConditionalTokenConfig,
): string => {
  const css = new FileBuilder(
    [
      '/* stylelint-disable declaration-property-value-allowed-list */',
      '/* stylelint-disable declaration-property-value-disallowed-list */',
      '/* Auto generated from design-tokens lib */',
      ':root,',
      '::backdrop {\n',
    ].join('\n'),
    '\n}',
  );
  css.indent();

  // Iterate through groups
  for (const [_, group] of tree) {
    css.addLines(...cssTranspiler.startGroup(group.name));
    // Iterate through values
    for (const [_, variable] of group.children) {
      css.addLine(cssTranspiler.transpileVariable(group.name, variable, tree));
    }
    css.addLines(...cssTranspiler.endGroup());
  }

  // Iterate through conditionals
  for (const [_, group] of conditionals) {
    group.children.forEach((variable) => {
      css.addLines(...cssTranspiler.startGroup(`Conditional: ${group.name}`));
      css.addLine(`${variable.statement} {`);
      css.indent();
      css.addLine(cssTranspiler.transpileVariable(group.name, variable.value, tree));
      css.unindent();
      css.addLine('}');
    });
  }

  return css.toString();
};
