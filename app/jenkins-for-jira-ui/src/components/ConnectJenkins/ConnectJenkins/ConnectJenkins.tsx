import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { ConfigurationSteps } from '../ConfigurationSteps/ConfigurationSteps';
import { StyledH1, StyledInstallationContainer, StyledInstallationContent } from '../ConnectJenkins.styles';
import { JenkinsConfigurationForm } from '../../JenkinsConfigurationForm/JenkinsConfigurationForm';
import { getWebhookUrl, isFormValid, setName } from '../../../common/util/jenkinsConnectionsUtils';
import { spinnerMarginTop } from '../../../common/styles/spinner.styles';
import { JenkinsSpinner } from '../../JenkinsSpinner/JenkinsSpinner';
import { getJenkinsServerWithSecret } from '../../../api/getJenkinsServerWithSecret';
import { updateJenkinsServer } from '../../../api/updateJenkinsServer';
import { ConnectLogos } from '../ConnectLogos/ConnectLogos';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsTrackEventsEnum,
	AnalyticsUiEventsEnum
} from '../../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../../common/analytics/analytics-client';

export interface ParamTypes {
	id: string;
	admin: string;
}

const analyticsClient = new AnalyticsClient();

const ConnectJenkins = () => {
	const history = useHistory();
	const { id: uuid } = useParams<ParamTypes>();
	const [webhookUrl, setWebhookUrl] = useState('');
	const [serverName, setServerName] = useState('');
	const [secret, setSecret] = useState<string | undefined>('');
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const getServer = useCallback(async () => {
		try {
			const { name, secret: retrievedSecret } = await getJenkinsServerWithSecret(uuid);
			setServerName(name);
			setSecret(retrievedSecret);
		} catch (e) {
			console.error('No Jenkins server found.');
		}
	}, [uuid]);

	useEffect(() => {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.ScreenEvent,
			AnalyticsScreenEventsEnum.ConnectJenkinsServerScreenName
		);
		getWebhookUrl(setWebhookUrl, uuid);
		getServer();
	}, [uuid, getServer]);

	const onSubmitUpdateServer = async () => {
		if (isFormValid(serverName, setHasError, setErrorMessage)) {
			setIsLoading(true);
			// Pass in empty pipelines. The update function will retrieve the latest pipelines
			// This prevents out of date pipelines overwriting the latest version
			try {
				await analyticsClient.sendAnalytics(
					AnalyticsEventTypes.UiEvent,
					AnalyticsUiEventsEnum.ConnectJenkinsServerName,
					{
						source: AnalyticsScreenEventsEnum.ConnectJenkinsServerScreenName,
						action: 'clicked Connect',
						actionSubject: 'button'
					}
				);

				await updateJenkinsServer({
					name: serverName,
					uuid,
					secret,
					pipelines: []
				});

				await analyticsClient.sendAnalytics(
					AnalyticsEventTypes.TrackEvent,
					AnalyticsTrackEventsEnum.ConnectedJenkinsServerSuccessName,
					{
						source: AnalyticsScreenEventsEnum.ConnectJenkinsServerScreenName,
						action: 'submitted connect server form success',
						actionSubject: 'form'
					}
				);

				history.push('/');
			} catch (e) {
				console.error('Error: ', e);

				await analyticsClient.sendAnalytics(
					AnalyticsEventTypes.TrackEvent,
					AnalyticsTrackEventsEnum.ConnectedJenkinsServerErrorName,
					{
						source: AnalyticsScreenEventsEnum.ConnectJenkinsServerScreenName,
						action: 'submitted connect server form error',
						actionSubject: 'form',
						error: e
					}
				);

				setIsLoading(false);
			}
		}
	};

	const pageTitle = 'Connect Jenkins to your Jira site';

	return (
		<StyledInstallationContainer>
			<ConfigurationSteps currentStage={'connect'} />
			<ConnectLogos />

			<StyledH1>{pageTitle}</StyledH1>

			{webhookUrl && secret
				? <>
					<StyledInstallationContent>
						<JenkinsConfigurationForm
							onSubmit={onSubmitUpdateServer}
							submitButtonText='Done'
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
				: <JenkinsSpinner secondaryClassName={spinnerMarginTop} />
			}
		</StyledInstallationContainer>
	);
};

export {
	ConnectJenkins
};
