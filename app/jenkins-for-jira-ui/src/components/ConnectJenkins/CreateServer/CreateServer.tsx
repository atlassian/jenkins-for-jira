import React, { useEffect, useState } from 'react';
import Button, { LoadingButton } from '@atlaskit/button';
import Form, {
	FormFooter
} from '@atlaskit/form';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router';
import {
	loadingIcon
} from '../../JenkinsConfigurationForm/JenkinsConfigurationForm.styles';
import { createJenkinsServer } from '../../../api/createJenkinsServer';
import { ConfigurationSteps } from '../ConfigurationSteps/ConfigurationSteps';
import { StyledH1, StyledInstallationContainer, StyledInstallationContent } from '../ConnectJenkins.styles';
import { isFormValid, setName } from '../../../common/util/jenkinsConnectionsUtils';
import { ServerConfigurationFormName } from '../../JenkinsConfigurationForm/ServerConfigurationFormElements/ServerConfigurationFormName/ServerConfigurationFormName';
import { ConnectLogos } from '../ConnectLogos/ConnectLogos';
import { AnalyticsClient } from '../../../common/analytics/analytics-client';
import {
	AnalyticsEventTypes,
	AnalyticsScreenEventsEnum,
	AnalyticsTrackEventsEnum,
	AnalyticsUiEventsEnum
} from '../../../common/analytics/analytics-events';
import { generateNewSecret } from '../../../api/generateNewSecret';
import { generateNewSecretUNSAFE } from '../../JenkinsConfigurationForm/JenkinsConfigurationForm';
import { FeatureFlags, useFeatureFlag } from '../../../hooks/useFeatureFlag';

const analyticsClient = new AnalyticsClient();

const CreateServer = () => {
	const serverSecretGenerationFlag = useFeatureFlag<boolean>(FeatureFlags.SERVER_SECRET_GENERATION);
	const history = useHistory();
	const [serverName, setServerName] = useState('');
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		analyticsClient.sendAnalytics(
			AnalyticsEventTypes.ScreenEvent,
			AnalyticsScreenEventsEnum.CreateJenkinsServerScreenName
		);
	}, []);

	const onSubmitCreateServer = async () => {
		await analyticsClient.sendAnalytics(
			AnalyticsEventTypes.UiEvent,
			AnalyticsUiEventsEnum.CreateJenkinsServerName,
			{
				source: AnalyticsScreenEventsEnum.CreateJenkinsServerScreenName,
				action: 'clicked Create',
				actionSubject: 'button'
			}
		);

		if (isFormValid(serverName, setHasError, setErrorMessage)) {
			setIsLoading(true);
			const uuid = uuidv4();

			try {
				await createJenkinsServer({
					name: serverName,
					uuid,
					secret: serverSecretGenerationFlag ? await generateNewSecret() : generateNewSecretUNSAFE(),
					pipelines: []
				});

				await analyticsClient.sendAnalytics(
					AnalyticsEventTypes.TrackEvent,
					AnalyticsTrackEventsEnum.CreatedJenkinsServerSuccessName,
					{
						source: AnalyticsScreenEventsEnum.CreateJenkinsServerScreenName,
						action: 'submitted create server form success',
						actionSubject: 'form'
					}
				);

				history.push(`/connect/${uuid}`);
			} catch (e) {
				console.error('Error: ', e);

				await analyticsClient.sendAnalytics(
					AnalyticsEventTypes.TrackEvent,
					AnalyticsTrackEventsEnum.CreatedJenkinsServerErrorName,
					{
						source: AnalyticsScreenEventsEnum.CreateJenkinsServerScreenName,
						action: 'submitted create server form error',
						actionSubject: 'form',
						error: e
					}
				);

				setIsLoading(false);
			}
		}
	};

	return (
		<StyledInstallationContainer>
			<ConfigurationSteps currentStage={'create'} />
			<ConnectLogos />

			<StyledH1>Create your Jenkins Server</StyledH1>
			<StyledInstallationContent>
				<Form onSubmit={onSubmitCreateServer}>
					{({ formProps }: any) => (
						<form {...formProps} name='create-server-form' data-testid="createServerForm">
							<ServerConfigurationFormName
								serverName={serverName}
								setServerName={(event: React.ChangeEvent<HTMLInputElement>) =>
									setName(event, setServerName)
								}
								hasError={hasError}
								errorMessage={errorMessage}
								setHasError={setHasError}
								serverNameHelperText={'Enter a name for your server. You can change this at any time.'}
							/>

							<FormFooter>
								{isLoading
									? <LoadingButton appearance='primary' isLoading className={loadingIcon} testId='loading-button' />
									: <Button type='submit' appearance='primary' testId='submit-button'>
										Create
									</Button>
								}
							</FormFooter>
						</form>
					)}
				</Form>
			</StyledInstallationContent>
		</StyledInstallationContainer>
	);
};

export {
	CreateServer
};
