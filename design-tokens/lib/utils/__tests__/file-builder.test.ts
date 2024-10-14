import { FileBuilder } from '../file-builder';

describe('FileBuilder', () => {
  it('should append/prepend given headers/footers', () => {
    const builder = new FileBuilder('header', 'footer');
    expect(builder.toString()).toBe('header\nfooter\n');
  });

  it('should add lines', () => {
    const builder = new FileBuilder();
    builder.addLines('line1', 'line2');
    expect(builder.toString()).toBe('line1\nline2\n');
  });

  it('should calculate indentation correctly', () => {
    expect(FileBuilder.Indent).toBe(2);
    expect(FileBuilder.indentationStr).toBe('  ');
  });

  it('should trim lines', () => {
    const builder = new FileBuilder();
    builder.addLine('  line1  ');
    builder.addLine('  line2  ');
    expect(builder.toString()).toBe('line1\nline2\n');
  });

  it('should indent lines', () => {
    const builder = new FileBuilder();
    builder.addLine('line1');
    builder.indent();
    builder.addLine('line2');
    builder.addLine('line3');
    builder.unindent();
    builder.addLine('line4');
    expect(builder.toString()).toBe('line1\n  line2\n  line3\nline4\n');
  });

  it('should indent lines multiple times', () => {
    const builder = new FileBuilder();
    builder.indent();
    builder.addLines('line1', 'line2');
    builder.indent();
    builder.addLines('line3', 'line4');
    builder.unindent();
    builder.addLine('line5');
    expect(builder.toString()).toBe('  line1\n  line2\n    line3\n    line4\n  line5\n');
  });

  it('should add empty lines', () => {
    const builder = new FileBuilder();
    builder.addLine();
    builder.addLine();
    expect(builder.toString()).toBe('\n\n');
  });
});
