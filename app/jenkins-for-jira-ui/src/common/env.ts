export interface EnvVars {
	LAUNCHDARKLY_TEST_CLIENT_ID: string;
	LAUNCHDARKLY_TEST_USER_KEY: string;
	LAUNCHDARKLY_DEVELOPMENT_CLIENT_ID: string;
	LAUNCHDARKLY_DEVELOPMENT_USER_KEY: string;
	LAUNCHDARKLY_STAGING_CLIENT_ID: string;
	LAUNCHDARKLY_STAGING_USER_KEY: string;
	LAUNCHDARKLY_PRODUCTION_CLIENT_ID: string;
	LAUNCHDARKLY_PRODUCTION_USER_KEY: string;
}

const envVars: EnvVars = {
	LAUNCHDARKLY_TEST_CLIENT_ID: process.env.REACT_APP_LAUNCHDARKLY_TEST_CLIENT_ID || '',
	LAUNCHDARKLY_TEST_USER_KEY: process.env.REACT_APP_LAUNCHDARKLY_TEST_USER_KEY || '',
	LAUNCHDARKLY_DEVELOPMENT_CLIENT_ID: process.env.REACT_APP_LAUNCHDARKLY_DEVELOPMENT_CLIENT_ID || '',
	LAUNCHDARKLY_DEVELOPMENT_USER_KEY: process.env.REACT_APP_LAUNCHDARKLY_DEVELOPMENT_USER_KEY || '',
	LAUNCHDARKLY_STAGING_CLIENT_ID: process.env.REACT_APP_LAUNCHDARKLY_STAGING_CLIENT_ID || '',
	LAUNCHDARKLY_STAGING_USER_KEY: process.env.REACT_APP_LAUNCHDARKLY_STAGING_USER_KEY || '',
	LAUNCHDARKLY_PRODUCTION_CLIENT_ID: process.env.REACT_APP_LAUNCHDARKLY_PRODUCTION_CLIENT_ID || '',
	LAUNCHDARKLY_PRODUCTION_USER_KEY: process.env.REACT_APP_LAUNCHDARKLY_PRODUCTION_USER_KEY || ''
};

export default envVars;
