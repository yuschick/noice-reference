import { ObjectValues } from '../types';

export const PerfMarks = {
  start: 'START',
  load: 'LOAD',
  parse: 'PARSE',
  transpile: 'TRANSPILE',
  export: 'EXPORT',
} as const;

type PerfSegment = ObjectValues<typeof PerfMarks>;

// shorthand
const measure = (...args: Parameters<Performance['measure']>) =>
  performance.measure(...args);

export class PerfReport {
  public static Mark(segment: PerfSegment): void {
    performance.mark(segment);
  }

  public static GenerateReport(): string {
    const total = measure('total', PerfMarks.start, PerfMarks.export);
    const load = measure('load', PerfMarks.start, PerfMarks.load);
    const parse = measure('parse', PerfMarks.load, PerfMarks.parse);
    const transpile = measure('transpile', PerfMarks.parse, PerfMarks.transpile);
    const out = measure('out', PerfMarks.transpile, PerfMarks.export);

    return [
      `Completed in ${total.duration}ms.`,
      `- load config: ${load.duration}ms`,
      `- parse config: ${parse.duration}ms`,
      `- transpilation: ${transpile.duration}ms`,
      `- write files: ${out.duration}ms`,
    ].join(`\n`);
  }
}
