import React from 'react';
import { cx } from '@emotion/css';
import { JenkinsSyncJiraIcon } from '../icons/JenkinsSyncJiraIcon';
import { connectionWizardHeader } from './ConnectionWizard.styles';
import { jenkinsSetupServerName, jenkinsSetupServerNameContainer } from '../JenkinsSetup/JenkinsSetup.styles';
import { connectionFlowHeaderContainer } from '../../GlobalStyles.styles';

const ConnectionFlowHeader = (): JSX.Element => {
	return (
		<div className={cx(connectionFlowHeaderContainer)}>
			<JenkinsSyncJiraIcon />
			<h3 className={cx(connectionWizardHeader)}>Connect Jenkins to Jira</h3>
		</div>
	);
};

type ConnectionFlowServerNameSubHeaderProps = {
	serverName: string
};

const ConnectionFlowServerNameSubHeader = ({ serverName }: ConnectionFlowServerNameSubHeaderProps): JSX.Element => {
	return (
		<p className={cx(jenkinsSetupServerNameContainer)}>
			Server name:&nbsp;
			<span className={cx(jenkinsSetupServerName)}>{serverName}</span>
		</p>
	);
};

export { ConnectionFlowHeader, ConnectionFlowServerNameSubHeader };
