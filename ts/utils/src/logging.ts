/* eslint-disable @typescript-eslint/no-explicit-any, no-console */
type LogFunction = (...args: any[]) => void;

let verboseLogging = false;

export interface Logger {
  log: LogFunction;
  logInfo: LogFunction;
  logWarn: LogFunction;
  logError: LogFunction;
  logVerbose: LogFunction;
  logInfoVerbose: LogFunction;
  logWarnVerbose: LogFunction;
  logErrorVerbose: LogFunction;
}

/**
 * Caches the logging functions for specific prefixes, for use among many files.
 * @type {Object.<string, Loggers>}
 */
const activeLoggers: Map<string, Logger> = new Map();

/**
 * Makes a collection of logging functions with the given prefix.
 * Returns an already created collection if the prefix is already in the cache.
 *
 * @param {string} prefix The prefix to add prepend to each log.
 * @returns {Loggers} A collection of logging functions with the given prefix.
 */
export function makeLoggers(prefix: string): Logger {
  // Just return the current logger for this prefix if it already exists.
  if (activeLoggers.has(prefix)) {
    return activeLoggers.get(prefix) as Logger;
  }

  // Otherwise, create.
  const loggers: Logger = {
    log: (...args) => console.log(`[${prefix}]`, ...args),
    logInfo: (...args) => console.info(`[${prefix}]`, ...args),
    logWarn: (...args) => console.warn(`[${prefix}]`, ...args),
    logError: (...args) => console.error(`[${prefix}]`, ...args),
    logVerbose: (...args) =>
      verboseLogging && console.log(`[${prefix}][VERBOSE]`, ...args),
    logInfoVerbose: (...args) =>
      verboseLogging && console.info(`[${prefix}][VERBOSE]`, ...args),
    logWarnVerbose: (...args) =>
      verboseLogging && console.warn(`[${prefix}][VERBOSE]`, ...args),
    logErrorVerbose: (...args) =>
      verboseLogging && console.error(`[${prefix}][VERBOSE]`, ...args),
  };

  activeLoggers.set(prefix, loggers);
  return loggers;
}

export function setVerboseLogging(value: boolean) {
  verboseLogging = value;
}
