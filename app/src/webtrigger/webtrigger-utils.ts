import { JenkinsAppError } from '../common/error';
import { WebtriggerRequest, WebtriggerResponse } from './types';
import { Logger } from '../config/logger';
/**
 * Translates certain errors into an appropriate webtrigger response.
 */
function handleWebtriggerError(request: WebtriggerRequest, error: any, logger: Logger): WebtriggerResponse {
	if (error instanceof JenkinsAppError) {
		return createWebtriggerResponse(400, error.message);
	}

	// In case of an unexpected error, we want to bubble up the error so that Forge recognizes the invocation as
	// failed and it shows up in the metrics.
	logger.error('handleWebtriggerError error', { error, errorMsg: error.message });
	throw error;
}

function createWebtriggerResponse(
	statusCode: number,
	body: object | string
): WebtriggerResponse {
	const defaultHeaders = {
		'Content-Type': ['application/json']
	};
	return {
		body: typeof body === 'string' ? body : JSON.stringify(body),
		statusCode,
		headers: defaultHeaders
	};
}

export { handleWebtriggerError, createWebtriggerResponse };
