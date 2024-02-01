import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { cx } from '@emotion/css';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button/standard-button';
import { router } from '@forge/bridge';
import { ParamTypes } from '../ConnectJenkins/ConnectJenkins/ConnectJenkins';
import { connectionFlowContainer, connectionFlowInnerContainer } from '../../GlobalStyles.styles';
import { ConnectionFlowHeader, ConnectionFlowServerNameSubHeader } from '../ConnectionWizard/ConnectionFlowHeader';
import { getJenkinsServerWithSecret } from '../../api/getJenkinsServerWithSecret';
import { loadingContainer } from '../JenkinsSetup/JenkinsSetup.styles';
import { serverNameFormOuterContainer } from '../ServerNameForm/ServerNameForm.styles';
import { connectionCompleteConfirmation, connectionCompleteContent } from './ConnectionComplete.styles';
import { AnalyticsEventTypes, AnalyticsScreenEventsEnum } from '../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../common/analytics/analytics-client';

const analyticsClient = new AnalyticsClient();

const ConnectionComplete = () => {
	const history = useHistory();
	const { path } = useParams<ParamTypes>();
	const { admin: isJenkinsAdmin, id: uuid } = useParams<ParamTypes>();
	const [serverName, setServerName] = useState('');

	const getServer = useCallback(async () => {
		try {
			const { name } = await getJenkinsServerWithSecret(uuid);
			setServerName(name);
		} catch (e) {
			console.error('No Jenkins server found.');
		}
	}, [uuid]);

	useEffect(() => {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.ScreenEvent,
			AnalyticsScreenEventsEnum.ConnectionCompleteScreenName
		);

		const fetchData = async () => {
			try {
				getServer();
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [uuid, getServer, isJenkinsAdmin]);

	const handleNavigateToConnectionServerManagementScreen = (e: React.MouseEvent) => {
		e.preventDefault();

		if (path === 'global') {
			router.navigate('https://rachelletestjira.atlassian.net/jira/apps/df76f661-4cbe-4768-a119-13992dc4ce2d/2113b3a2-5043-4d97-8db0-31d7e2379e3c');
		}

		history.push('/');
	};

	return (
		<div className={cx(connectionFlowContainer)}>
			<ConnectionFlowHeader />

			{!serverName ? (
				<div className={cx(loadingContainer)} data-testid="loading-spinner">
					<Spinner size='large' />
				</div>
			) : (
				<>
					<ConnectionFlowServerNameSubHeader serverName={serverName} />
					<div className={cx(serverNameFormOuterContainer)}>
						<div className={cx(connectionFlowInnerContainer)}>
							<h4 className={cx(connectionCompleteConfirmation)}>Connection complete</h4>

							{isJenkinsAdmin === 'is-admin'
								? <p className={cx(connectionCompleteContent)}>Your Jenkins server is now connected.</p>
								: <p className={cx(connectionCompleteContent)}>
										Your Jenkins admin will complete this connection and
										let you know when it’s ready.
								</p>
							}

							<p className={cx(connectionCompleteContent)}>
								To use this connection, choose what data this server sends to Jira in server management.
							</p>

							<Button
								appearance="primary"
								onClick={(e) => handleNavigateToConnectionServerManagementScreen(e)}
							>
								Go to server management
							</Button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export { ConnectionComplete };
