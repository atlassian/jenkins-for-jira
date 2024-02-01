import React, { useState, useEffect } from 'react';
import {
	Router,
	Switch,
	Route
} from 'react-router';
import styled from '@emotion/styled';
import { view } from '@forge/bridge';
import { token, setGlobalTheme } from '@atlaskit/tokens';
import { InstallJenkins } from './components/ConnectJenkins/InstallJenkins/InstallJenkins';
import { JenkinsServerList } from './components/JenkinsServerList/JenkinsServerList';
import { ConnectJenkins } from './components/ConnectJenkins/ConnectJenkins/ConnectJenkins';
import { ManageConnection } from './components/ManageConnection/ManageConnection';
import { spinnerHeight } from './common/styles/spinner.styles';
import { JenkinsSpinner } from './components/JenkinsSpinner/JenkinsSpinner';
import { PendingDeploymentState } from './components/JenkinsServerList/PendingDeploymentState/PendingDeploymentState';
import { CreateServer } from './components/ConnectJenkins/CreateServer/CreateServer';
import { fetchFeatureFlagFromBackend } from './api/fetchFeatureFlagFromBackend';
import { ServerManagement } from './components/ServerManagement/ServerManagement';
import { ServerNameForm } from './components/ServerNameForm/ServerNameForm';
import { JenkinsSetup } from './components/JenkinsSetup/JenkinsSetup';
import { ConnectionComplete } from './components/ConnectionComplete/ConnectionComplete';
import { GlobalPage } from './components/GlobalPage/GlobalPage';
import { fetchModuleKey } from './api/fetchModuleKey';
import { ConnectionWizard } from './components/ConnectionWizard/ConnectionWizard';
import { FeatureFlags } from './common/featureFlags';

const AppContainer = styled.div`
	color: #172B4D;
	margin: ${token('space.200')} ${token('space.400')} ${token('space.300')} ${token('space.0')};
	padding-bottom: ${token('space.300')};
`;

const GlobalContainer = styled.div`
	margin: auto;
	max-width: 936px;
	padding-bottom: ${token('space.300')};
`;

const App: React.FC = () => {
	const [history, setHistory] = useState<any>(null);
	const [isFetchingFlag, setIsFetchingFlag] = useState<boolean>(false);
	const [renovateConfigFlag, setRenovateConfigFlag] = useState<boolean>(false);
	const [checkUserPermissionsFlag, setCheckUserPermissionsFlag] = useState<boolean>(false);
	const [moduleKey, setModuleKey] = useState<string>('');

	const getModuleKey = async () => {
		const currentModuleKey = await fetchModuleKey();
		setModuleKey(currentModuleKey);
	};

	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			setIsFetchingFlag(true);

			try {
				const renovatedJenkinsFeatureFlag = await fetchFeatureFlagFromBackend(
					FeatureFlags.RENOVATED_JENKINS_FOR_JIRA_CONFIG_FLOW
				);

				const checkUserPermissions = await fetchFeatureFlagFromBackend(
					FeatureFlags.CHECK_USER_PERMISSIONS
				);

				getModuleKey();

				if (isMounted) {
					setRenovateConfigFlag(renovatedJenkinsFeatureFlag);
					setCheckUserPermissionsFlag(checkUserPermissions);
					setIsFetchingFlag(false);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
				setIsFetchingFlag(false);
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

	if (!history || isFetchingFlag || !moduleKey) {
		return <JenkinsSpinner secondaryClassName={spinnerHeight} />;
	}

	setGlobalTheme({
		light: 'light',
		dark: 'dark',
		colorMode: 'auto',
		spacing: 'spacing',
		typography: 'typography-adg3'
	});

	return (
		<>
			{moduleKey === 'jenkins-for-jira-global-page' ? (
				<GlobalContainer>
					<Router history={history}>
						<Switch>
							<Route path="/">
								<GlobalPage checkUserPermissionsFlag={checkUserPermissionsFlag} />
							</Route>
						</Switch>
					</Router>
				</GlobalContainer>
			) : (
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
							<Route path="/create-server/:path">
								<ServerNameForm />
							</Route>
							<Route path="/update-server-name/:id/:path">
								<ServerNameForm />
							</Route>
							<Route path="/setup/:id/:settings/:path">
								<JenkinsSetup />
							</Route>
							<Route path="/connection-complete/:id/:admin/:path">
								<ConnectionComplete />
							</Route>
							<Route path="/connection-info/:path">
								<ConnectionWizard />
							</Route>
						</Switch>
					</Router>
				</AppContainer>
			)}
		</>
	);
};

export default App;
