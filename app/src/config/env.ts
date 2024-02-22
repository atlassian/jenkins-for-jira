export interface EnvVars {
    LAUNCHDARKLY_API_KEY: string;
    LAUNCHDARKLY_APP_NAME: string;
    ANALYTICS_URL?: string;
    ANALYTICS_STAGE_URL?: string;
    JENKINS_ENV: string;
}

const envVars: EnvVars = {
    LAUNCHDARKLY_API_KEY: process.env.LAUNCHDARKLY_API_KEY || '',
    LAUNCHDARKLY_APP_NAME: process.env.LAUNCHDARKLY_APP_NAME || 'jenkins-for-jira',
    ANALYTICS_URL: process.env.ANALYTICS_URL,
    ANALYTICS_STAGE_URL: process.env.ANALYTICS_STAGE_URL,
    JENKINS_ENV: process.env.JENKINS_ENV || ''
};

export type Environment = 'test' | 'development' | 'staging' | 'production';

export default envVars;
