import React, { useState } from 'react';
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
	const [serverName, setServerName] = useState('');
	const [hasError, setHasError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const onSubmitCreateServer = async () => {
		if (isFormValid(serverName, setHasError, setErrorMessage)) {
			setIsLoading(true);
			const uuid = uuidv4();

			try {
				await createJenkinsServer({
					name: serverName,
					uuid,
					secret: generateNewSecret(),
					pipelines: []
				});
				history.push(`/connect/${uuid}`);
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
									:	<Button type='submit' appearance='primary' testId='submit-button'>
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
