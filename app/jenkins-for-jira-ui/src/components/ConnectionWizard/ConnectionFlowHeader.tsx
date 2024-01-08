import React from 'react';
import { cx } from '@emotion/css';
import { JenkinsSyncJiraIcon } from '../icons/JenkinsSyncJiraIcon';
import { connectionWizardHeader } from './ConnectionWizard.styles';

const ConnectionFlowHeader = (): JSX.Element => {
	return (
		<>
			<JenkinsSyncJiraIcon />
			<h3 className={cx(connectionWizardHeader)}>Connect Jenkins to Jira</h3>
		</>
	);
};

export { ConnectionFlowHeader };
