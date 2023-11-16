import React, { useState, useEffect, useCallback } from 'react';
import {
	Router,
	Switch,
	Route
} from 'react-router';
import styled from '@emotion/styled';
import { view } from '@forge/bridge';
import { withLDProvider } from 'launchdarkly-react-client-sdk';
import { setGlobalTheme } from '@atlaskit/tokens';
import { InstallJenkins } from './components/ConnectJenkins/InstallJenkins/InstallJenkins';
import { JenkinsServerList } from './components/JenkinsServerList/JenkinsServerList';
import { ConnectJenkins } from './components/ConnectJenkins/ConnectJenkins/ConnectJenkins';
import { ManageConnection } from './components/ManageConnection/ManageConnection';
import { spinnerHeight } from './common/styles/spinner.styles';
import { JenkinsSpinner } from './components/JenkinsSpinner/JenkinsSpinner';
import { PendingDeploymentState } from './components/JenkinsServerList/PendingDeploymentState/PendingDeploymentState';
import { CreateServer } from './components/ConnectJenkins/CreateServer/CreateServer';
import envVars, { Environment } from './common/env';
import { fetchFeatureFlagFromBackend } from './api/fetchFeatureFlagFromBackend';
import { FeatureFlags } from './hooks/useFeatureFlag';
import { MainPage } from './components/MainPage/MainPage';

const {
	LAUNCHDARKLY_TEST_CLIENT_ID,
	LAUNCHDARKLY_TEST_USER_KEY,
	LAUNCHDARKLY_DEVELOPMENT_CLIENT_ID,
	LAUNCHDARKLY_DEVELOPMENT_USER_KEY,
	LAUNCHDARKLY_STAGING_CLIENT_ID,
	LAUNCHDARKLY_STAGING_USER_KEY,
	LAUNCHDARKLY_PRODUCTION_CLIENT_ID,
	LAUNCHDARKLY_PRODUCTION_USER_KEY
} = envVars;

export const environmentSettings = {
	test: {
		clientSideID: LAUNCHDARKLY_TEST_CLIENT_ID,
		user: { key: LAUNCHDARKLY_TEST_USER_KEY }
	},
	development: {
		clientSideID: LAUNCHDARKLY_DEVELOPMENT_CLIENT_ID,
		user: { key: LAUNCHDARKLY_DEVELOPMENT_USER_KEY }
	},
	staging: {
		clientSideID: LAUNCHDARKLY_STAGING_CLIENT_ID,
		user: { key: LAUNCHDARKLY_STAGING_USER_KEY }
	},
	production: {
		clientSideID: LAUNCHDARKLY_PRODUCTION_CLIENT_ID,
		user: { key: LAUNCHDARKLY_PRODUCTION_USER_KEY }
	}
};

const AppContainer = styled.div`
	color: #172B4D;
	margin: 24px 36px 24px 0;
`;

const App: React.FC = () => {
	const [history, setHistory] = useState<any>(null);
	const [renovateConfigFlag, setRenovateConfigFlag] = useState<boolean>(false);

	const fetchFeatureFlag = useCallback(async () => {
		const renovatedJenkinsFeatureFlag = await fetchFeatureFlagFromBackend(
			FeatureFlags.RENOVATED_JENKINS_FOR_JIRA_CONFIG_FLOW
		);
		setRenovateConfigFlag(renovatedJenkinsFeatureFlag);
	}, []);

	useEffect(() => {
		view.createHistory().then((historyUpdates) => {
			setHistory(historyUpdates);
		});
		fetchFeatureFlag();
	}, [fetchFeatureFlag]);

	if (!history) {
		return <JenkinsSpinner secondaryClassName={spinnerHeight} />;
	}

	setGlobalTheme({
		light: 'light',
		dark: 'dark',
		colorMode: 'auto',
		spacing: 'spacing',
		typography: 'typography'
	});

	return (
		<AppContainer>
			<Router history={history}>
				<Switch>
					<Route exact path="/">
						{renovateConfigFlag
							? <MainPage />
							: <JenkinsServerList />
						}
					</Route>
					<Route path="/install">
						<InstallJenkins />
					</Route>
					<Route path="/create">
						<CreateServer />
					</Route>
					<Route path="/connect/:id">
						<ConnectJenkins />
					</Route>
					<Route path="/manage/:id">
						<ManageConnection />
					</Route>
					<Route path="/pending/:id">
						<PendingDeploymentState />
					</Route>
				</Switch>
			</Router>
		</AppContainer>
	);
};

const getLDProviderConfig = (environment: Environment) => {
	const config = environmentSettings[environment] || environmentSettings.development;

	return {
		clientSideID: config.clientSideID || '',
		user: {
			key: config.user.key || ''
		},
		reactOptions: {
			useCamelCaseFlagKeys: false
		},
		options: { disableSyncEventPost: true }
	};
};

const AppWithLDProvider = withLDProvider(getLDProviderConfig(process.env.NODE_ENV))(App);

export default AppWithLDProvider;
