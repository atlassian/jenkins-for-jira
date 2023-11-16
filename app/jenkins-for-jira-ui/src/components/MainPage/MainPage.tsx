import React from 'react';
import PageHeader from '@atlaskit/page-header';
import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/standard-button';
import { headerContainer } from '../JenkinsServerList/JenkinsServerList.styles';
import { TopPanel } from './TopPanel/TopPanel';
import { mainPageContainer } from './MainPage.styles';

const MainPage = (): JSX.Element => {
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

	return (
		<div className={mainPageContainer}>
			<div className={headerContainer}>
				<PageHeader actions={pageHeaderActions}>Jenkins for Jira</PageHeader>
			</div>

			<TopPanel />
		</div>
	);
};

export { MainPage };
