import React from 'react';
import { cx } from '@emotion/css';
import PeopleGroup from '@atlaskit/icon/glyph/people-group';
import { connectionWizardContainer, connectionWizardInfoBox } from './ConnectionWizard.styles';

const ConnectionWizard = (): JSX.Element => {
	return (
		<div className={cx(connectionWizardContainer)}>
			<h3>Connect Jenkins to Jira</h3>
			<p>To complete this connection you'll need:</p>

			<ol>
				<li>An active Jenkins server</li>
				<li>Team knowledge</li>
				<li>The help of your Jenkins admin</li>
			</ol>

			<div className={cx(connectionWizardInfoBox)}>
				<PeopleGroup label="people-group" />
				<p>
					Not sure who should use this guide? It depends how your teams use Jenkins.&nbsp;
				</p>
			</div>
		</div>
	);
};

export { ConnectionWizard };
