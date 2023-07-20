export enum Errors {
    JWT_VERIFICATION_FAILED = 'JWT verification failed. Please make sure you configured the same secret in Jenkins and Jira',
    JWT_DECODING_ERROR = 'Could not parse payload as JSON',
    UNSUPPORTED_REQUEST_TYPE = 'Unsupported requestType',
    MISSING_CLOUD_ID = 'No CloudID provided',
    MISSING_UUID = 'No UUID provided',
    INVOCATION_ERROR = 'An error occurred while invoking the resolved',
    MISSING_ACCOUNT_ID = 'No account ID provided',
    NOT_ADMIN = 'Only Jira administrators can access the Jenkins for Jira admin page'
}
