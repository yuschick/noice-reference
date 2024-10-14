import { outputFile } from 'fs-extra';
import YAML from 'yamljs';

import { buildCss } from './build-css';
import { buildTs } from './build-ts';
import { YamlInput, TokenGroup, parseGroup } from './parser';
import { ConditionalTokenConfig, TokenConfig } from './types';
import { PerfReport } from './utils/perf-report';

function parse(raw: YamlInput, isConditional = false): Map<string, TokenGroup> {
  const tree: Map<string, TokenGroup> = new Map();
  const keys = Object.keys(raw);

  // Iterate through normal groups
  for (const groupKeyI in keys) {
    const group = parseGroup(keys[groupKeyI], raw, isConditional);

    // Ignore groups without any children
    if (group.children.size === 0) {
      continue;
    }

    tree.set(group.name, group);
  }

  return tree;
}

function main(filePath: string) {
  if (!filePath) {
    throw new Error('File path not found.');
  }

  console.log(`Loading config ${filePath}...`);
  PerfReport.Mark('START');
  YAML.load(filePath, async (result: YamlInput) => {
    PerfReport.Mark('LOAD');
    console.log(`Parsing config...`);

    try {
      const { 'conditional-values': conditionalValues, ...rawConfig } = result;

      const tree = parse(rawConfig) as TokenConfig;
      const conditionalTree = parse(
        conditionalValues ?? {},
        true,
      ) as ConditionalTokenConfig;

      PerfReport.Mark('PARSE');
      console.log(`Compiling to css and ts...`);

      // Note: Using promises to do this in parallel wound up being
      // a net negative; creating a promise doesn't ACTUALLY parallelize
      // the logic, and spawning a worker to truly parallelize it takes
      // too long to be useful.
      const cssString = buildCss(tree, conditionalTree);
      const tsString = buildTs(tree, conditionalTree);
      PerfReport.Mark('TRANSPILE');
      console.log(`Writing files...`);

      // Write to files
      await Promise.all([
        outputFile('gen/brand.css', cssString, { encoding: 'utf-8' }),
        outputFile('gen/brand.ts', tsString, { encoding: 'utf-8' }),
      ]);
      console.log('Done! Files written to gen/brand.css and gen/brand.ts\n');
    } catch (err) {
      throw new Error(err);
    }

    PerfReport.Mark('EXPORT');
    console.log(PerfReport.GenerateReport());
    process.exit(0);
  });
}

main(process.argv[2]);
