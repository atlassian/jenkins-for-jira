// TODO - figure out issue with types
import Logger, {
    createLogger,
    LogLevel,
    Serializers,
    Stream
// @ts-ignore
} from 'bunyan';
import { merge, omit } from 'lodash';

export const defaultLogLevel: LogLevel = process.env.LOG_LEVEL as LogLevel || 'info';

interface LoggerOptions {
    fields?: Record<string, unknown>;
    streams?: Stream[];
    level?: LogLevel;
    stream?: NodeJS.WritableStream;
    serializers?: Serializers;
    src?: boolean;
    filterHttpRequests?: boolean;
}

export const getLogger = (name: string, options: LoggerOptions = {}): Logger => {
    return createLogger({
        name,
        level: defaultLogLevel
    });
};

const consoleLogger = getLogger('console');
// eslint-disable-next-line no-console
console.debug = consoleLogger.debug.bind(consoleLogger);
// eslint-disable-next-line no-console
console.error = consoleLogger.error.bind(consoleLogger);
// eslint-disable-next-line no-console
console.log = consoleLogger.info.bind(consoleLogger);
// eslint-disable-next-line no-console
console.warn = consoleLogger.warn.bind(consoleLogger);
