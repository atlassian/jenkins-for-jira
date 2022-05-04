import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import Button from '@atlaskit/button';
import { JiraSoftwareIcon } from '@atlaskit/logo';
import { B200, B400 } from '@atlaskit/theme/colors';
import Spinner from '@atlaskit/spinner';
import {
	subheadingText,
	descriptionText,
	pendingDeploymentContainer,
	pendingDeploymentIconContainer,
	checkSpacer
} from './PendingDeploymentState.styles';
import { JenkinsIcon } from '../../icons/JenkinsIcon';
import { getJenkinsServerWithSecret } from '../../../api/getJenkinsServerWithSecret';

interface ParamTypes {
	id: string;
	name: string;
}

const PendingDeploymentState = () => {
	const history = useHistory();
	const [serverName, setServerName] = useState('');
	const { id: jenkinsServerUuid } = useParams<ParamTypes>();

	const onClickManage = () => {
		history.push(`/manage/${jenkinsServerUuid}`);
	};

	const getServer = useCallback(async () => {
		const { name } = await getJenkinsServerWithSecret(jenkinsServerUuid);
		setServerName(name);
	}, [jenkinsServerUuid]);

	useEffect(() => {
		getServer();
	}, [getServer, jenkinsServerUuid]);

	return (
		<div className={pendingDeploymentContainer}>
			<h2>Waiting for {serverName} deployment event...</h2>
			<p className={subheadingText}>
				Include issue keys in your commit messages to start tracking your deployments.{' '}
				Check back here after a few deployments to verify that it’s working.
			</p>

			<div className={pendingDeploymentIconContainer}>
				<JiraSoftwareIcon
					iconColor={B200}
					iconGradientStart={B400}
					iconGradientStop={B200}
					size='large'
				/>
				<span className={checkSpacer} />
				<Spinner size='large' />
				<span className={checkSpacer} />
				<JenkinsIcon data-testid="jenkins-icon-connect" />
			</div>

			<p className={descriptionText}>
				If you have already sent a deployment event,{' '}
				check that your integration configuration or Jenkinsfile is correct.
			</p>
			<Button onClick={() => onClickManage()}>
				Manage connection
			</Button>
		</div>
	);
};

export {
	PendingDeploymentState
};
