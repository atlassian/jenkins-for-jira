import { MissingCloudIdError } from '../common/error';
import { Errors } from '../common/error-messages';

export function extractCloudId(installContext: string): string {
	if (!installContext || typeof installContext !== 'string') {
		throw new MissingCloudIdError(Errors.MISSING_CLOUD_ID);
	}
	return installContext.replace('ari:cloud:jira::site/', '');
}

export function getQueryParameterValue(name: string, queryParameters: any): string | null {
	if (queryParameters[name] && queryParameters[name].length > 0) {
		return queryParameters[name][0];
	}
	return null;
}
