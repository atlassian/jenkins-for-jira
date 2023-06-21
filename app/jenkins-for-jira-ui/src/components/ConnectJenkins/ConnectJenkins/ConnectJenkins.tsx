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
import { AnalyticsEventTypes, AnalyticsScreenEventsEnum } from '../../../common/analytics/analytics-events';
import { AnalyticsClient } from '../../../common/analytics/analytics-client';

interface ParamTypes {
	id: string;
}

const analyticsClient = new AnalyticsClient();

const ConnectJenkins = () => {
	const history = useHistory();
	const { id: uuid } = useParams<ParamTypes>();
	const [webhookUrl, setWebhookUrl] = useState('');
	const [serverName, setServerName] = useState('');
	const [secret, setSecret] = useState('');
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

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
			<ConfigurationSteps currentStage={'connect'} />
			<ConnectLogos />

			<StyledH1>Connect Jenkins to your Jira site</StyledH1>

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
