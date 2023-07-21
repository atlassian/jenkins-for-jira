import Logger, { createLogger, LogLevel } from 'bunyan';

export const defaultLogLevel: LogLevel = process.env.LOG_LEVEL as LogLevel || 'info';

export const getLogger = (name: string): Logger => {
    return createLogger({
        name,
        level: defaultLogLevel,
        streams: [{
            level: 'trace', // Priority of levels looks like this: Trace -> Debug -> Info -> Warn -> Error -> Fatal
            stream: process.stdout, // Developers will want to see this piped to their consoles
        }]
    });
};

export const testlog = createLogger({ name: 'myapp' });

const consoleLogger = getLogger('console');
// eslint-disable-next-line no-console
console.debug = consoleLogger.debug.bind(consoleLogger);
// eslint-disable-next-line no-console
console.error = consoleLogger.error.bind(consoleLogger);
// eslint-disable-next-line no-console
console.log = consoleLogger.info.bind(consoleLogger);
// eslint-disable-next-line no-console
console.warn = consoleLogger.warn.bind(consoleLogger);
