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
			{/* TODO - add onClick event */}
			<Button appearance="primary">
				Connect a new Jenkins server
			</Button>
			{/* TODO - add onClick event */}
			<Button>Share page</Button>
		</ButtonGroup>
	);

	// TODO - if there are no servers, render connection wizard instead of toppanel + connection panel
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
