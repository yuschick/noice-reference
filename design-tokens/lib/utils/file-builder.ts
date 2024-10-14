export class FileBuilder {
  public static readonly Indent = 2;
  public static get indentationStr() {
    return new Array(FileBuilder.Indent + 1).join(' ');
  }

  private _header: string;
  private _footer: string;
  private _result: string;
  private _indentation = '';

  constructor(header?: string, footer?: string) {
    this._header = header ? header.trim() + '\n' : '';
    this._footer = footer ? footer.trim() + '\n' : '';
    this._result = '';
  }

  public addLines(...lines: string[]) {
    for (const line of lines) {
      this.addLine(line);
    }
  }

  public addLine(line?: string) {
    if (!line) {
      this._result += '\n';
      return;
    }

    this._result += this._indentation + line.trim() + '\n';
  }

  public indent() {
    this._indentation += FileBuilder.indentationStr;
  }

  public unindent() {
    const indentLevel = this._indentation.length - FileBuilder.Indent;
    this._indentation = this._indentation.substr(0, indentLevel);
  }

  public toString() {
    return this._header + this._result + this._footer;
  }
}
