interface LogData {
	eventType: string;
	data?: Object;
	errorMsg?: string;
	error?: any;
}

interface LogError {
	eventType: string;
	errorMsg?: string;
	error?: any;
}

function log(
	name: string,
	logLevel: 'info' | 'warn' | 'error' | 'debug',
	logData: LogData | LogError
) {
	switch (logLevel) {
		case 'warn': {
			console.warn(`WARN: ${name} - ${logData}`);
			break;
		}
		case 'error': {
			console.error(`ERROR: ${name} - ${logData}`);
			break;
		}
		case 'debug': {
			console.debug(`DEBUG: ${name} - ${logData}`);
			break;
		}
		default: {
			console.log(`INFO: ${name} - ${logData}`);
			break;
		}
	}
}

export { log };
