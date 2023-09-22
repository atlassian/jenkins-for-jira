export enum Errors {
	JWT_VERIFICATION_FAILED = 'JWT verification failed. Please make sure you configured the same secret in Jenkins and Jira',
	UNSUPPORTED_REQUEST_TYPE = 'Unsupported requestType',
	MISSING_CLOUD_ID = 'No CloudID provided',
	MISSING_UUID = 'No UUID provided',
	INVOCATION_ERROR = 'An error occurred while invoking the resolved',
	MISSING_REQUIRED_PROPERTIES = 'Required properties were not provided',
	INVALID_EVENT_TYPE = 'Invalid event type'
}
