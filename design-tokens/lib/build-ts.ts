import { tsTranspiler } from './transpilers/ts-transpiler';
import { ConditionalTokenConfig, TokenConfig } from './types';
import { FileBuilder } from './utils/file-builder';

export const buildTs = (
  tree: TokenConfig,
  _conditionals: ConditionalTokenConfig,
): string => {
  const ts = new FileBuilder('/* Auto generated from design-tokens lib */\n\n');

  // Iterate through groups
  for (const [_, group] of tree) {
    const lines: string[] = [];

    // Iterate through values
    for (const [_, variable] of group.children) {
      const tsLine = tsTranspiler.transpileVariable(group.name, variable, tree);

      if (tsLine !== '') {
        lines.push(tsLine);
      }
    }

    if (lines.length === 0) {
      continue;
    }

    ts.addLines(...tsTranspiler.startGroup(group.name));
    ts.indent();
    ts.addLines(...lines);
    ts.unindent();
    ts.addLines(...tsTranspiler.endGroup());
  }

  return ts.toString();
};
