import React, { useState, useEffect } from 'react';
import {
	Router,
	Switch,
	Route
} from 'react-router';
import styled from '@emotion/styled';
import { view } from '@forge/bridge';
import { token, setGlobalTheme } from '@atlaskit/tokens';
import { withLDProvider } from 'launchdarkly-react-client-sdk';
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
import { ServerManagement } from './components/ServerManagement/ServerManagement';
import { ServerNameForm } from './components/ServerNameForm/ServerNameForm';
import { JenkinsSetup } from './components/JenkinsSetup/JenkinsSetup';
import { ConnectionComplete } from './components/ConnectionComplete/ConnectionComplete';

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
	margin: ${token('space.200')} ${token('space.400')} ${token('space.300')} ${token('space.0')};
	padding-bottom: ${token('space.300')};
`;

const App: React.FC = () => {
	const [history, setHistory] = useState<any>(null);
	const [isFetchingFlag, setIsFetchingFlag] = useState<boolean>(false);
	const [renovateConfigFlag, setRenovateConfigFlag] = useState<boolean>(false);

	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			setIsFetchingFlag(true);

			try {
				const renovatedJenkinsFeatureFlag = await fetchFeatureFlagFromBackend(
					FeatureFlags.RENOVATED_JENKINS_FOR_JIRA_CONFIG_FLOW
				);

				if (isMounted) {
					setRenovateConfigFlag(renovatedJenkinsFeatureFlag);
					setIsFetchingFlag(false);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();

		view.createHistory().then((historyUpdates) => {
			if (isMounted) {
				setHistory(historyUpdates);
			}
		});

		return () => {
			isMounted = false;
		};
	}, []);

	if (!history || isFetchingFlag) {
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
							? <ServerManagement />
							: <JenkinsServerList />
						}
					</Route>

					{/* TODO - delete routes for old version post renovate rollout */}
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
					<Route path="/create-server">
						<ServerNameForm />
					</Route>
					<Route path="/update-server-name/:id">
						<ServerNameForm />
					</Route>
					<Route path="/setup/:id/:settings">
						<JenkinsSetup />
					</Route>
					<Route path="/connection-complete/:id/:admin">
						<ConnectionComplete />
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
