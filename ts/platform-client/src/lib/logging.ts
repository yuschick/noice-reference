export enum LogLevel {
  DISABLED = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
}

let globalLogLevel =
  process.env.NODE_ENV !== 'production' ? LogLevel.DEBUG : LogLevel.ERROR;

export function setGlobalLogLevel(logLevel: LogLevel) {
  globalLogLevel = logLevel;
}

export class Logger {
  private _name: string;
  private _props: { [key: string]: any };

  constructor(name: string, props: { [key: string]: any } = {}) {
    this._name = name;
    this._props = props;
  }

  private _logArgs(message: string, ...args: any[]): any[] {
    const props = Object.keys(this._props).map((key) => `${key}: ${this._props[key]}`);

    return [this._name, ...props, '>', message, ...args];
  }

  public debug(message: string, ...args: any[]): void {
    if (globalLogLevel < LogLevel.DEBUG) {
      return;
    }

    args = args.map((arg) => {
      if (typeof arg === 'string') {
        if (arg.indexOf('{') === 0) {
          try {
            return JSON.parse(arg);
          } catch (e) {
            return arg;
          }
        }
      }

      return arg;
    });
    console.debug(...this._logArgs(message, ...args));
  }

  public info(message: string, ...args: any[]): void {
    if (globalLogLevel < LogLevel.INFO) {
      return;
    }

    console.info(...this._logArgs(message, ...args));
  }

  public warn(message: string, ...args: any[]): void {
    if (globalLogLevel < LogLevel.WARN) {
      return;
    }

    console.warn(...this._logArgs(message, ...args));
  }

  public error(message: string, ...args: any[]): void {
    console.error(...this._logArgs(message, ...args));
  }

  public sub(name: string): Logger {
    return new Logger(`${this._name}.${name}`);
  }

  public subWithProps(name: string, props: { [key: string]: any }): Logger {
    return new Logger(`${this._name}.${name}`, props);
  }

  public withProps(props: { [key: string]: any }): Logger {
    return new Logger(this._name, props);
  }
}

export function logger(name: string): Logger {
  return new Logger(name);
}
