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
import { generateNewSecret } from '../../JenkinsConfigurationForm/JenkinsConfigurationForm';
import { isFormValid, setName } from '../../../common/util/jenkinsConnectionsUtils';
import { ServerConfigurationFormName } from '../../JenkinsConfigurationForm/ServerConfigurationFormElements/ServerConfigurationFormName/ServerConfigurationFormName';
import { ConnectLogos } from '../ConnectLogos/ConnectLogos';

const CreateServer = () => {
	const history = useHistory();
	const [uuid] = useState(uuidv4);
	const [serverName, setServerName] = useState('');
	const [secret, setSecret] = useState('');
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		setSecret(generateNewSecret());
	}, [uuid]);

	const createServer = async () => {
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
				history.push('/connect');
			} catch (e) {
				console.error('Error: ', e);
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
				<Form onSubmit={createServer}>
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
							/>

							<FormFooter>
								{isLoading
									? <LoadingButton appearance='primary' isLoading className={loadingIcon} testId='loading-button' />
									:	<Button type='submit' appearance='primary' testId='submit-button'>
										Next
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
