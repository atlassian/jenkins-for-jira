interface LogData {
	eventType: string;
	data?: Object;
	message?: string;
}

interface LogError {
	eventType: string;
	errorMsg?: string;
	error?: any;
}

// Define color constants for different log levels
enum LogColors {
	INFO = '\x1b[32m', // Green for INFO
	WARN = '\x1b[33m', // Yellow for WARN
	ERROR = '\x1b[31m', // Red for ERROR
	DEBUG = '\x1b[35m', // Magenta for DEBUG
	RESET = '\x1b[0m', // Reset color to default
}

const logMessage = (
	logLevel: keyof typeof LogColors,
	name: string,
	timestamp: string,
	formattedLogData: string
): string => {
	const logColor = LogColors[logLevel];
	return `${logColor}${logLevel}${LogColors.RESET}: [${timestamp}] ${name} - ${formattedLogData}`;
};

const log = (
	name: string,
	logLevel: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG',
	logData: LogData | LogError
): void => {
	const timestamp = new Date().toISOString();
	const formattedLogData = JSON.stringify(logData);
	const message = logMessage(logLevel, name, timestamp, formattedLogData);

	switch (logLevel) {
		case 'WARN': {
			console.warn(message);
			break;
		}
		case 'ERROR': {
			console.error(message);
			break;
		}
		case 'DEBUG': {
			console.debug(message);
			break;
		}
		default: {
			console.log(message);
			break;
		}
	}
};

export { log };
