import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router';
import { createJenkinsServer } from '../../../api/createJenkinsServer';
import { ConfigurationSteps } from '../ConfigurationSteps/ConfigurationSteps';
import { StyledInstallationContainer, StyledInstallationContent } from '../ConnectJenkins.styles';
import { JenkinsConfigurationForm, generateNewSecret } from '../../JenkinsConfigurationForm/JenkinsConfigurationForm';
import { getWebhookUrl, isFormValid, setName } from '../../../common/util/jenkinsConnectionsUtils';
import { spinnerMarginTop } from '../../../common/styles/spinner.styles';
import { JenkinsSpinner } from '../../JenkinsSpinner/JenkinsSpinner';

const ConnectJenkins = () => {
	const history = useHistory();
	const [uuid] = useState(uuidv4);
	const [webhookUrl, setWebhookUrl] = useState('');
	const [serverName, setServerName] = useState('');
	const [secret, setSecret] = useState('');
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		getWebhookUrl(setWebhookUrl, uuid);
		setSecret(generateNewSecret());
	}, [uuid]);

	const connectServer = async () => {
		const isValidForm = isFormValid(serverName, setHasError, setErrorMessage);

		if (isValidForm) {
			setIsLoading(true);

			try {
				await createJenkinsServer({
					name: serverName,
					uuid,
					secret,
					pipelines: []
				});
				// TODO: Update this when API is available
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

			<h1>Connect Jenkins to your Jira site</h1>

			{webhookUrl && secret
				? <>
					<StyledInstallationContent>
						<JenkinsConfigurationForm
							onSubmit={connectServer}
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
