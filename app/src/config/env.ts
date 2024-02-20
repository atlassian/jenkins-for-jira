export interface EnvVars {
    LAUNCHDARKLY_API_KEY: string;
    LAUNCHDARKLY_APP_NAME: string;
    JENKINS_ENV: string;
}

const envVars: EnvVars = {
    LAUNCHDARKLY_API_KEY: 'api-b2bde546-9fd0-4ec1-97f1-abc1b61b3674' || process.env.LAUNCHDARKLY_API_KEY || '',
    LAUNCHDARKLY_APP_NAME: process.env.LAUNCHDARKLY_APP_NAME || 'jenkins-for-jira',
    JENKINS_ENV: process.env.JENKINS_ENV || ''
};

export type Environment = 'test' | 'development' | 'staging' | 'production';

export default envVars;
