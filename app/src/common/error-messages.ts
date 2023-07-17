export enum Errors {
    JWT_VERIFICATION_FAILED = 'JWT verification failed. Please make sure you configured the same secret in Jenkins and Jira',
    JWT_DECODING_ERROR = 'Could not parse payload as JSON',
    UNSUPPORTED_REQUEST_TYPE = 'Unsupported requestType',
    MISSING_CLOUD_ID = 'No CloudID provided'
}
