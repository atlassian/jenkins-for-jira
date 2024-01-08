import React from 'react';
import { cx } from '@emotion/css';
import { JenkinsSyncJiraIcon } from '../icons/JenkinsSyncJiraIcon';
import { connectionWizardHeader } from './ConnectionWizard.styles';
import { jenkinsSetupServerName } from '../JenkinsSetup/JenkinsSetup.styles';

const ConnectionFlowHeader = (): JSX.Element => {
	return (
		<>
			<JenkinsSyncJiraIcon />
			<h3 className={cx(connectionWizardHeader)}>Connect Jenkins to Jira</h3>
		</>
	);
};

type ConnectionFlowServerNameSubHeaderProps = {
	serverName: string
};

const ConnectionFlowServerNameSubHeader = ({ serverName }: ConnectionFlowServerNameSubHeaderProps): JSX.Element => {
	return (
		<p className={cx(jenkinsSetupServerName)}>Server name: {serverName}</p>
	);
};

export { ConnectionFlowHeader, ConnectionFlowServerNameSubHeader };
