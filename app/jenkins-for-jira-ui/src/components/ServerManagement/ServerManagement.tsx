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
			{/* TODO handle empty state - ARC-2730 connection wizard */}
			<Button appearance="primary">
				Connect a new Jenkins server
			</Button>
			{/* TODO - ARC-2723 share modal */}
			<Button>Share page</Button>
		</ButtonGroup>
	);

	// TODO handle empty state - ARC-2730 connection wizard
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
