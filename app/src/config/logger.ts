export enum LogLevel {
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR',
	DEBUG = 'DEBUG'
}

enum LogColors {
	INFO = '\x1b[32m',
	WARN = '\x1b[33m',
	ERROR = '\x1b[31m',
	DEBUG = '\x1b[35m',
	RESET = '\x1b[0m'
}

export interface LogData {
	[key: string]: any;
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

	private log(logLevel: LogLevel, logData: LogData): void {
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

	public info(message: string, logData?: LogData): void {
		this.logWithLevel(LogLevel.INFO, message, logData);
	}

	public warn(message: string, logData?: LogData): void {
		this.logWithLevel(LogLevel.WARN, message, logData);
	}

	public error(message: string, logData?: LogData): void {
		this.logWithLevel(LogLevel.ERROR, message, logData);
	}

	public debug(message: string, logData?: LogData): void {
		this.logWithLevel(LogLevel.DEBUG, message, logData);
	}

	private logWithLevel(level: LogLevel, message: string, logData?: LogData): void {
		if (logData) {
			this.log(level, { ...logData, message });
		} else {
			this.log(level, { message });
		}
	}
}
