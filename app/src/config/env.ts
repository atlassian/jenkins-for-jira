export interface EnvVars {
    LAUNCHDARKLY_API_KEY: string;
    LAUNCHDARKLY_APP_NAME: string;
    NODE_ENV: string;
}

const envVars: EnvVars = {
    LAUNCHDARKLY_API_KEY: process.env.LAUNCHDARKLY_API_KEY || '',
    LAUNCHDARKLY_APP_NAME: process.env.LAUNCHDARKLY_APP_NAME || 'jenkins-for-jira',
    NODE_ENV: process.env.NODE_ENV || 'development'
};

export type Environment = 'test' | 'development' | 'staging' | 'production';

export default envVars;
