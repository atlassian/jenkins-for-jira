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
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsTrackEventsEnum,
	AnalyticsUiEventsEnum
} from '../../common/analytics/analytics-events';

interface ParamTypes {
	id: string;
}

const analyticsClient = new AnalyticsClient();

const ManageConnection = () => {
	const history = useHistory();
	const { id: uuid } = useParams<ParamTypes>();
	const [webhookUrl, setWebhookUrl] = useState('');
	const [serverName, setServerName] = useState('');
	const [secret, setSecret] = useState<string | undefined>('');
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleNavigateBackClick = async (): Promise<void> => {
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.NavigateBackManageJenkinsConnectionName,
			{
				source: AnalyticsScreenEventsEnum.ManageJenkinsConnectionScreenName,
				action: 'clicked back manage connection',
				actionSubject: 'button'
			}
		);

		history.push('/');
	};

	const handleNavigateBackKeyDown = async (event: React.KeyboardEvent): Promise<void> => {
		if (event.code === 'Enter') {
			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.UiEvent,
				AnalyticsUiEventsEnum.NavigateBackManageJenkinsConnectionName,
				{
					source: AnalyticsScreenEventsEnum.ManageJenkinsConnectionScreenName,
					action: 'pressed enter key',
					actionSubject: 'keydown'
				}
			);
			history.push('/');
		}
	};

	const handleClickHelp = async (event: React.MouseEvent): Promise<void> => {
		event.preventDefault();
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.ManageConnectionHelpLinkName,
			{
				source: AnalyticsScreenEventsEnum.ManageJenkinsConnectionScreenName,
				action: 'clicked help link',
				actionSubject: 'button'
			}
		);
	};

	const getServer = useCallback(async () => {
		try {
			const { name, secret: retrievedSecret } = await getJenkinsServerWithSecret(uuid);
			setServerName(name);
			setSecret(retrievedSecret);

			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.TrackEvent,
				AnalyticsTrackEventsEnum.GetServerSuccessManageConnectionName,
				{
					source: AnalyticsScreenEventsEnum.ManageJenkinsConnectionScreenName
				}
			);
		} catch (e) {
			console.error('No Jenkins server found.');

			await analyticsClient.sendAnalytics(
				AnalyticsEventTypes.TrackEvent,
				AnalyticsTrackEventsEnum.GetServerErrorManageConnectionName,
				{
					source: AnalyticsScreenEventsEnum.ManageJenkinsConnectionScreenName,
					error: e
				}
			);
		}
	}, [uuid]);

	useEffect(() => {
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

				await analyticsClient.sendAnalytics(
					AnalyticsEventTypes.TrackEvent,
					AnalyticsTrackEventsEnum.UpdatedServerSuccessName,
					{
						source: AnalyticsScreenEventsEnum.ManageJenkinsConnectionScreenName,
						action: 'submitted manage server form success',
						actionSubject: 'form'
					}
				);

				history.push('/');
			} catch (e) {
				console.error('Error: ', e);

				await analyticsClient.sendAnalytics(
					AnalyticsEventTypes.TrackEvent,
					AnalyticsTrackEventsEnum.UpdatedServerErrorName,
					{
						source: AnalyticsScreenEventsEnum.ManageJenkinsConnectionScreenName,
						action: 'submitted manage server form error',
						actionSubject: 'form',
						error: e
					}
				);

				setIsLoading(false);
			}
		}
	};

	const pageTitle = 'Manage Jenkins Connection';

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
					onClick={handleClickHelp}
				>
					<QuestionIcon label="help"/>
					<p className={helpLink}>Help</p>
				</a>
			</header>
			<h1>{pageTitle}</h1>

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
							pageTitle={pageTitle}
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
