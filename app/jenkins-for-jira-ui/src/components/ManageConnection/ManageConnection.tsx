import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import { StyledInstallationContainer, StyledInstallationContent } from '../ConnectJenkins/ConnectJenkins.styles';
import { JenkinsConfigurationForm } from '../JenkinsConfigurationForm/JenkinsConfigurationForm';
import { getJenkinsServerWithSecret } from '../../api/getJenkinsServerWithSecret';
import { updateJenkinsServer } from '../../api/updateJenkinsServer';
import { getWebhookUrl, isFormValid, setName } from '../../common/util/jenkinsConnectionsUtils';
import { spinnerMarginTop } from '../../common/styles/spinner.styles';
import { JenkinsSpinner } from '../JenkinsSpinner/JenkinsSpinner';
import {
	headerContainer,
	helpLinkContainer,
	helpLink,
	navigateBackContainer
} from './ManageConnection.styles';
import { AnalyticsClient } from '../../common/analytics/analytics-client';
import { AnalyticsEventTypes, AnalyticsScreenEventsEnum } from '../../common/analytics/analytics-events';

interface ParamTypes {
	id: string;
}

const ManageConnection = () => {
	const history = useHistory();
	const { id: uuid } = useParams<ParamTypes>();
	const [webhookUrl, setWebhookUrl] = useState('');
	const [serverName, setServerName] = useState('');
	const [secret, setSecret] = useState<string>('');
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleNavigateBackClick = (): void => {
		history.push('/');
	};

	const handleNavigateBackKeyDown = (event: React.KeyboardEvent): void => {
		if (event.code === 'Enter') {
			history.push('/');
		}
	};

	const getServer = useCallback(async () => {
		try {
			const { name, secret: retrievedSecret } = await getJenkinsServerWithSecret(uuid);
			setServerName(name);
			setSecret(retrievedSecret!);
		} catch (e) {
			console.error('No Jenkins server found.');
		}
	}, [uuid]);

	useEffect(() => {
		const analyticsClient = new AnalyticsClient();
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.ScreenEvent,
			AnalyticsScreenEventsEnum.ManageJenkinsConnectionScreenName
		);
		getWebhookUrl(setWebhookUrl, uuid);
		getServer();
	}, [uuid, getServer]);

	const updateServer = async () => {
		const isValidForm = isFormValid(serverName, setHasError, setErrorMessage);

		if (isValidForm) {
			setIsLoading(true);
			// Pass in empty pipelines. The update function will retrieve the latest pipelines
			// This prevents out of date pipelines overwriting the latest version
			try {
				await updateJenkinsServer({
					name: serverName,
					uuid,
					secret,
					pipelines: []
				});

				history.push('/');
			} catch (e) {
				console.error('Error: ', e);
				setIsLoading(false);
			}
		}
	};

	return (
		<StyledInstallationContainer>
			<header className={headerContainer}>
				<button
					className={navigateBackContainer}
					onClick={handleNavigateBackClick}
					onKeyDown={handleNavigateBackKeyDown}
				>
					<ArrowLeftIcon label="Go back" />
				</button>

				<a
					className={helpLinkContainer}
					href="https://support.atlassian.com/jira-cloud-administration/docs/integrate-with-jenkins"
					aria-label="Read our support docs for help"
				>
					<QuestionIcon label="help"/>
					<p className={helpLink}>Help</p>
				</a>
			</header>
			<h1>Manage Jenkins Connection</h1>

			{webhookUrl && secret
				? <>
					<StyledInstallationContent>
						<JenkinsConfigurationForm
							onSubmit={updateServer}
							submitButtonText="Done"
							webhookUrl={webhookUrl}
							serverName={serverName}
							setServerName={(event: React.ChangeEvent<HTMLInputElement>) =>
								setName(event, setServerName)
							}
							secret={secret}
							setSecret={setSecret}
							hasError={hasError}
							errorMessage={errorMessage}
							setHasError={setHasError}
							isLoading={isLoading}
						/>
					</StyledInstallationContent>
				</>
				:	<JenkinsSpinner secondaryClassName={spinnerMarginTop} />
			}
		</StyledInstallationContainer>
	);
};

export {
	ManageConnection
};
