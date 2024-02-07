import React from 'react';
import {
	render, waitFor, screen
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { GlobalPage } from './GlobalPage';
import { GLOBAL_PAGE } from '../../common/constants';
import * as getAllJenkinsServersModule from '../../api/getAllJenkinsServers';
import * as fetchModuleKeyModule from '../../api/fetchModuleKey';
import * as fetchGlobalPageUrlModule from '../../api/fetchGlobalPageUrl';
import * as fetchUserPermsModule from '../../api/fetchUserPerms';
import { EventType, JenkinsServer } from '../../../../src/common/types';

jest.mock('../../api/fetchGlobalPageUrl');
jest.mock('../../api/getAllJenkinsServers');
jest.mock('../../api/fetchGlobalPageUrl');
jest.mock('../../api/fetchUserPerms');

const servers: JenkinsServer[] = [
	{
		name: 'server one',
		uuid: '56046af9-d0eb-4efb-8896-6c9d0da884fe',
		pluginConfig: {
			ipAddress: '10.10.10.10',
			lastUpdatedOn: new Date()
		},
		pipelines: [
			{
				name: '#74315',
				lastEventType: EventType.DEPLOYMENT,
				lastEventStatus: 'successful',
				lastEventDate: new Date()
			},
			{
				name: '#1234',
				lastEventType: EventType.BUILD,
				lastEventStatus: 'failed',
				lastEventDate: new Date()
			}
		]
	},
	{
		name: 'server two',
		uuid: '56046af9-d0eb-4efb-8896-jsdfn8234234',
		pluginConfig: {
			ipAddress: '10.10.10.11',
			lastUpdatedOn: new Date()
		},
		pipelines: []
	},
	{
		name: 'server three',
		uuid: '56046af9-d0eb-4efb-8896-ehdf34bhsdf',
		pluginConfig: {
			ipAddress: '10.10.10.10',
			lastUpdatedOn: new Date()
		},
		pipelines: []
	},
	{
		name: 'server four',
		uuid: '56046af9-d0eb-4efb-8896-sjnd893rsd',
		pluginConfig: {
			ipAddress: '10.10.10.12',
			lastUpdatedOn: new Date()
		},
		pipelines: [
			{
				name: '#3456',
				lastEventType: EventType.BUILD,
				lastEventStatus: 'successful',
				lastEventDate: new Date()
			}
		]
	},
	{
		name: 'server five',
		uuid: '56046af9-d0eb-4efb-8896-ed182ende',
		pluginConfig: undefined,
		pipelines: [
			{
				name: '#6789',
				lastEventType: EventType.DEPLOYMENT,
				lastEventStatus: 'pending',
				lastEventDate: new Date()
			}
		]
	},
	{
		name: 'server six',
		uuid: '56046af9-d0eb-4efb-8896-hsdbf723rh2r',
		pluginConfig: {
			ipAddress: '10.10.10.10',
			lastUpdatedOn: new Date()
		},
		pipelines: [
			{
				name: '#3456',
				lastEventType: EventType.BUILD,
				lastEventStatus: 'successful',
				lastEventDate: new Date()
			}
		]
	},
	{
		name: 'server seven',
		uuid: '56046af9-d0eb-4efb-8896-iwer23rjesu',
		pluginConfig: {
			ipAddress: '10.10.10.10',
			lastUpdatedOn: new Date()
		},
		pipelines: []
	},
	{
		name: 'server eight',
		uuid: '56046af9-d0eb-4efb-8896-iwer23rjesu',
		pluginConfig: undefined,
		pipelines: []
	}
];

describe('GlobalPage Component', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should render loading spinner while fetching data', async () => {
		render(<GlobalPage checkUserPermissionsFlag={false} />);
		expect(await screen.findByTestId('jenkins-spinner')).toBeInTheDocument();
	});

	it('should render empty state when there are no servers', async () => {
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([]);
		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');
		jest.spyOn(fetchModuleKeyModule, 'fetchModuleKey').mockResolvedValueOnce(GLOBAL_PAGE);

		render(<GlobalPage checkUserPermissionsFlag={false} />);
		await waitFor(() => {});

		expect(screen.getByText('No servers connected')).toBeInTheDocument();
	});

	it('should render configured state when there are servers', async () => {
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([servers[4]]);
		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');
		jest.spyOn(fetchModuleKeyModule, 'fetchModuleKey').mockResolvedValueOnce(GLOBAL_PAGE);

		render(<GlobalPage checkUserPermissionsFlag={false} />);
		await waitFor(() => {});

		expect(screen.getByText(servers[4].name)).toBeInTheDocument();
	});

	it('should render only some buttons when checkUserPermissionsFlag is off', async () => {
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce(servers);
		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');
		jest.spyOn(fetchModuleKeyModule, 'fetchModuleKey').mockResolvedValueOnce(GLOBAL_PAGE);

		render(<GlobalPage checkUserPermissionsFlag={false} />);
		await waitFor(() => {});

		expect(screen.getByText('Share page')).toBeInTheDocument();
		expect(screen.queryByText('Connect a new Jenkins server button')).not.toBeInTheDocument();
		expect(screen.getByText('Learn more')).toBeInTheDocument();
	});

	it('should render only some buttons when user is not an admin', async () => {
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce(servers);
		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');
		jest.spyOn(fetchModuleKeyModule, 'fetchModuleKey').mockResolvedValueOnce(GLOBAL_PAGE);
		jest.spyOn(fetchUserPermsModule, 'fetchUserPerms').mockResolvedValueOnce(false);

		render(<GlobalPage checkUserPermissionsFlag={true} />);
		await waitFor(() => {});

		expect(screen.getByText('Share page')).toBeInTheDocument();
		expect(screen.queryByText('Connect a new Jenkins server button')).not.toBeInTheDocument();
		expect(screen.getByText('Learn more')).toBeInTheDocument();
	});

	it('should render all buttons when checkUserPermissionsFlag is on', async () => {
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce(servers);
		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');
		jest.spyOn(fetchModuleKeyModule, 'fetchModuleKey').mockResolvedValueOnce(GLOBAL_PAGE);
		jest.spyOn(fetchUserPermsModule, 'fetchUserPerms').mockResolvedValueOnce(true);

		render(<GlobalPage checkUserPermissionsFlag={true} />);
		await waitFor(() => {});

		expect(screen.getByText('Share page')).toBeInTheDocument();
		expect(screen.getByText('Connect a new Jenkins server')).toBeInTheDocument();
		expect(screen.getByText('Learn more')).toBeInTheDocument();
	});
});
