export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

enum LogColors {
    INFO = '\x1b[32m',
    WARN = '\x1b[33m',
    ERROR = '\x1b[31m',
    DEBUG = '\x1b[35m',
    RESET = '\x1b[0m',
}

export interface LogData {
    eventType: string;
    data?: Object;
    message?: string;
}

export interface LogError {
    eventType: string;
    status?: number;
    errorMsg?: string;
    error?: any;
}

const privateProperties = new WeakMap<Logger, { timestamp: string, name: string }>();

export class Logger {
    private static instance: Logger;

    private constructor(name: string) {
        if (!privateProperties.has(this)) {
            privateProperties.set(this, {
                timestamp: new Date().toISOString(),
                name
            });
        }
    }

    public static getInstance(name: string): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger(name);
        }
        return Logger.instance;
    }

    private getTimestamp(): string {
        return privateProperties.get(this)?.timestamp || '';
    }

    private getName(): string {
        return privateProperties.get(this)?.name || '';
    }

    private logMessage(logLevel: LogLevel, name: string, formattedLogData: string): string {
        const logColor = LogColors[logLevel];
        return `${logColor}${logLevel}${LogColors.RESET}: [${this.getTimestamp()}] ${name} - ${formattedLogData}`;
    }

    private log(logLevel: LogLevel, logData: LogData | LogError): void {
        const formattedLogData = JSON.stringify(logData);
        const message = this.logMessage(logLevel, this.getName(), formattedLogData);

        switch (logLevel) {
            case LogLevel.WARN: {
                console.warn(message);
                break;
            }
            case LogLevel.ERROR: {
                console.error(message);
                break;
            }
            case LogLevel.DEBUG: {
                console.debug(message);
                break;
            }
            default: {
                console.log(message);
                break;
            }
        }
    }

    public logInfo(logData: LogData | LogError): void {
        this.log(LogLevel.INFO, logData);
    }

    public logWarn(logData: LogData | LogError): void {
        this.log(LogLevel.WARN, logData);
    }

    public logError(logData: LogData | LogError): void {
        this.log(LogLevel.ERROR, logData);
    }

    public logDebug(logData: LogData | LogError): void {
        this.log(LogLevel.DEBUG, logData);
    }
}
