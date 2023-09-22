import { Logger, LogLevel } from './logger';

describe('Logger', () => {
	it('should be a singleton', () => {
		const logger1 = Logger.getInstance('logger1');
		const logger2 = Logger.getInstance('logger2');

		expect(logger1).toBe(logger2);
	});

	it('should not expose private properties', () => {
		const logger = Logger.getInstance('logger-test');
		expect(Object.prototype.hasOwnProperty.call(logger, 'name')).toBe(false);
		expect(Object.prototype.hasOwnProperty.call(logger, 'timestamp')).toBe(false);
	});

	it('should not expose private methods', () => {
		const logger = Logger.getInstance('logger-test');
		expect(Object.prototype.hasOwnProperty.call(logger, 'logMessage')).toBe(false);
		expect(Object.prototype.hasOwnProperty.call(logger, 'log')).toBe(false);
		expect(Object.prototype.hasOwnProperty.call(logger, 'getTimestamp')).toBe(false);
	});

	it('should log messages at different log levels', () => {
		const logger = Logger.getInstance('logger-test');

		const consoleLogSpy = jest.spyOn(console, 'log');
		const consoleWarnSpy = jest.spyOn(console, 'warn');
		const consoleErrorSpy = jest.spyOn(console, 'error');
		const consoleDebugSpy = jest.spyOn(console, 'debug');

		const logData = { eventType: 'TestEvent', data: { foo: 'bar' }, message: 'Testing log message' };

		logger.logInfo(logData);
		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(LogLevel.INFO));

		logger.logWarn(logData);
		expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining(LogLevel.WARN));

		logger.logError(logData);
		expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining(LogLevel.ERROR));

		logger.logDebug(logData);
		expect(consoleDebugSpy).toHaveBeenCalledWith(expect.stringContaining(LogLevel.DEBUG));

		const resetColorEscapeSequence = '\x1b[0m';
		expect(consoleLogSpy.mock.calls[0][0]).toContain(resetColorEscapeSequence);
		expect(consoleWarnSpy.mock.calls[0][0]).toContain(resetColorEscapeSequence);
		expect(consoleErrorSpy.mock.calls[0][0]).toContain(resetColorEscapeSequence);
		expect(consoleDebugSpy.mock.calls[0][0]).toContain(resetColorEscapeSequence);

		consoleLogSpy.mockRestore();
		consoleWarnSpy.mockRestore();
		consoleErrorSpy.mockRestore();
		consoleDebugSpy.mockRestore();
	});
});
