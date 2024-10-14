import { makeLoggers, setVerboseLogging } from '../logging';

describe('logging', () => {
  const param = 'Hello World!';
  const prefix = 'Test';
  const verboseSuffix = '[VERBOSE]';

  const getMockLog = (logFn: 'log' | 'info' | 'warn' | 'error') => {
    return jest.spyOn(console, logFn).mockImplementation(() => {});
  };

  describe('logging functions', () => {
    it('log', () => {
      setVerboseLogging(false);
      const { log } = makeLoggers(prefix);
      const mockLog = getMockLog('log');
      log(param);
      expect(mockLog).toBeCalledWith(`[${prefix}]`, param);
      mockLog.mockReset();
    });

    it('logInfo', () => {
      setVerboseLogging(false);
      const { logInfo } = makeLoggers(prefix);
      const mockLog = getMockLog('info');
      logInfo(param);
      expect(mockLog).toBeCalledWith(`[${prefix}]`, param);
      mockLog.mockReset();
    });

    it('logWarn', () => {
      setVerboseLogging(false);
      const { logWarn } = makeLoggers(prefix);
      const mockLog = getMockLog('warn');
      logWarn(param);
      expect(mockLog).toBeCalledWith(`[${prefix}]`, param);
      mockLog.mockReset();
    });

    it('logError', () => {
      setVerboseLogging(false);
      const { logError } = makeLoggers(prefix);
      const mockLog = getMockLog('error');
      logError(param);
      expect(mockLog).toBeCalledWith(`[${prefix}]`, param);
      mockLog.mockReset();
    });

    it('logVerbose', () => {
      setVerboseLogging(true);
      const { logVerbose } = makeLoggers(prefix);
      const mockLog = getMockLog('log');
      logVerbose(param);
      expect(mockLog).toBeCalledWith(`[${prefix}]${verboseSuffix}`, param);
      mockLog.mockReset();
    });

    it('logInfoVerbose', () => {
      setVerboseLogging(true);
      const { logInfoVerbose } = makeLoggers(prefix);
      const mockLog = getMockLog('info');
      logInfoVerbose(param);
      expect(mockLog).toBeCalledWith(`[${prefix}]${verboseSuffix}`, param);
      mockLog.mockReset();
    });

    it('logWarnVerbose', () => {
      setVerboseLogging(true);
      const { logWarnVerbose } = makeLoggers(prefix);
      const mockLog = getMockLog('warn');
      logWarnVerbose(param);
      expect(mockLog).toBeCalledWith(`[${prefix}]${verboseSuffix}`, param);
      mockLog.mockReset();
    });

    it('logErrorVerbose', () => {
      setVerboseLogging(true);
      const { logErrorVerbose } = makeLoggers(prefix);
      const mockLog = getMockLog('error');
      logErrorVerbose(param);
      expect(mockLog).toBeCalledWith(`[${prefix}]${verboseSuffix}`, param);
      mockLog.mockReset();
    });
  });
});
