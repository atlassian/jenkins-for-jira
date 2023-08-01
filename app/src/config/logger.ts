export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

// Define color constants for different log levels
enum LogColors {
    INFO = '\x1b[32m', // Green for INFO
    WARN = '\x1b[33m', // Yellow for WARN
    ERROR = '\x1b[31m', // Red for ERROR
    DEBUG = '\x1b[35m', // Magenta for DEBUG
    RESET = '\x1b[0m', // Reset color to default
}

export interface LogData {
    eventType: string;
    data?: Object;
    message?: string;
}

export interface LogError {
    eventType: string;
    errorMsg?: string;
    error?: any;
}

const privateProperties = new WeakMap<Logger, { timestamp: string }>();

export class Logger {
    private static instance: Logger;

    private constructor() {
        // Check if the private properties already exist for this instance
        if (!privateProperties.has(this)) {
            // Initialize the timestamp using the WeakMap to make it truly private
            privateProperties.set(this, { timestamp: new Date().toISOString() });
        }
        // Private constructor to initialize the singleton instance with a timestamp.
        // Constructor should not be used directly; use getInstance() method instead.
    }

    private getTimestamp(): string {
        // Retrieve the timestamp using the WeakMap
        return privateProperties.get(this)?.timestamp || '';
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private logMessage(logLevel: LogLevel, name: string, formattedLogData: string): string {
        const logColor = LogColors[logLevel];
        return `${logColor}${logLevel}${LogColors.RESET}: [${this.getTimestamp()}] ${name} - ${formattedLogData}`;
    }

    private log(logLevel: LogLevel, name: string, logData: LogData | LogError): void {
        const formattedLogData = JSON.stringify(logData);
        const message = this.logMessage(logLevel, name, formattedLogData);

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

    public logInfo(name: string, logData: LogData | LogError): void {
        this.log(LogLevel.INFO, name, logData);
    }

    public logWarn(name: string, logData: LogData | LogError): void {
        this.log(LogLevel.WARN, name, logData);
    }

    public logError(name: string, logData: LogData | LogError): void {
        this.log(LogLevel.ERROR, name, logData);
    }

    public logDebug(name: string, logData: LogData | LogError): void {
        this.log(LogLevel.DEBUG, name, logData);
    }
}
