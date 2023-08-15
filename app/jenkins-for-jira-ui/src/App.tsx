// App.tsx
import React, { useState, useEffect } from 'react';
import {
	Router,
	Switch,
	Route
} from 'react-router';
import styled from '@emotion/styled';
import { view } from '@forge/bridge';
import { LDProvider, useFlags } from 'launchdarkly-react-client-sdk';
import { InstallJenkins } from './components/ConnectJenkins/InstallJenkins/InstallJenkins';
import { JenkinsServerList } from './components/JenkinsServerList/JenkinsServerList';
import { ConnectJenkins } from './components/ConnectJenkins/ConnectJenkins/ConnectJenkins';
import { ManageConnection } from './components/ManageConnection/ManageConnection';
import { spinnerHeight } from './common/styles/spinner.styles';
import { JenkinsSpinner } from './components/JenkinsSpinner/JenkinsSpinner';
import { PendingDeploymentState } from './components/JenkinsServerList/PendingDeploymentState/PendingDeploymentState';
import { CreateServer } from './components/ConnectJenkins/CreateServer/CreateServer';

export const environmentSettings = {
	test: {
		clientSideID: '64d05a1b5cdc4d14fedc4e56',
		user: { key: 'sdk-aeaff188-afbb-4fd7-ac3a-7cb4c034b2f8' }
	},
	development: {
		clientSideID: '64d05a2c4131f214c0daa1f0',
		user: { key: 'sdk-523775d8-b59b-498a-bb1c-b0075215f045' }
	},
	staging: {
		clientSideID: '64d05a3506e74014c8213f23',
		user: { key: 'sdk-dcd7f409-0265-4d05-953b-fac576ecee12' }
	},
	production: {
		clientSideID: '64d05a1b5cdc4d14fedc4e57',
		user: { key: 'sdk-f09e34f8-8d85-42cd-a8d0-bee59c50b92b' }
	}
};

const AppContainer = styled.div`
	color: #172B4D;
	margin: 24px 24px 24px 0;
`;

const App: React.FC = () => {
	const [history, setHistory] = useState<any>(null);

	useEffect(() => {
		view.createHistory().then((historyUpdates) => {
			setHistory(historyUpdates);
		});
	}, []);

	if (!history) {
		return <JenkinsSpinner secondaryClassName={spinnerHeight} />;
	}

	return (
		<AppContainer>
			<Router history={history}>
				<Switch>
					<Route exact path="/">
						<JenkinsServerList />
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

// Define the ProviderConfig type
type ProviderConfig = {
	clientSideID: string;
	user: {
		key: string;
	};
	options?: object;
};

// Wrap the App component with the withLDProvider HOC using the environmentSettings
const WrappedApp: React.FC = () => {
	const currentEnvironment = process.env.NODE_ENV;
	const flagConfig = environmentSettings[currentEnvironment];
	const flags = useFlags();
	console.log('FLAGS', flags);
	const ldProviderConfig: ProviderConfig = {
		clientSideID: flagConfig.clientSideID,
		user: flagConfig.user,
		options: {} // Add any options if needed
	};

	return (
		<LDProvider {...ldProviderConfig}>
			<App />
		</LDProvider>
	);
};

export default WrappedApp;
