import React, { useState, useEffect } from 'react';
import {
	Router,
	Switch,
	Route
} from 'react-router';
import styled from '@emotion/styled';
import { view } from '@forge/bridge';
import { InstallJenkins } from './components/ConnectJenkins/InstallJenkins/InstallJenkins';
import { JenkinsServerList } from './components/JenkinsServerList/JenkinsServerList';
import { ConnectJenkins } from './components/ConnectJenkins/ConnectJenkins/ConnectJenkins';
import { ManageConnection } from './components/ManageConnection/ManageConnection';
import { spinnerHeight } from './common/styles/spinner.styles';
import { JenkinsSpinner } from './components/JenkinsSpinner/JenkinsSpinner';
import { PendingDeploymentState } from './components/JenkinsServerList/PendingDeploymentState/PendingDeploymentState';

const AppContainer = styled.div`
	color: #172B4D;
	margin: 24px 24px 24px 0;
`;

const App = () => {
	const [history, setHistory] = useState<any>(null);

	useEffect(() => {
		view.createHistory().then((historyUpdates) => {
			setHistory(historyUpdates);
		});
	}, []);

	return (
		<AppContainer>
			{history ? (
				<Router history={history}>
					<Switch>
						<Route exact path="/">
							<JenkinsServerList />
						</Route>
						<Route path="/install">
							<InstallJenkins />
						</Route>
						<Route path="/connect">
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
			) : (
				<JenkinsSpinner secondaryClassName={spinnerHeight} />
			)}
		</AppContainer>
	);
};

export default App;
