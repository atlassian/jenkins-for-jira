import React from 'react';
import PageHeader from '@atlaskit/page-header';
import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/standard-button';
import { headerContainer } from '../JenkinsServerList/JenkinsServerList.styles';
import { mainPageContainer } from './ServerManagement.styles';
import { ConnectionPanel } from '../ConnectionPanel/ConnectionPanel';
import { TopPanel } from './TopPanel/TopPanel';

const ServerManagement = (): JSX.Element => {
	const pageHeaderActions = (
		<ButtonGroup>
			{/* TODO - add onClick event (will be done when I build the new server name form */}
			<Button appearance="primary">
				Connect a new Jenkins server
			</Button>
			{/* TODO - add onClick event (will be done after spike for ARC-2691 */}
			<Button>Share page</Button>
		</ButtonGroup>
	);

	// TODO - render connection wizard (will be done when design for this is complete)
	return (
		<div className={mainPageContainer}>
			<div className={headerContainer}>
				<PageHeader actions={pageHeaderActions}>Jenkins for Jira</PageHeader>
			</div>

			<TopPanel />

			<ConnectionPanel />
		</div>
	);
};

export { ServerManagement };
