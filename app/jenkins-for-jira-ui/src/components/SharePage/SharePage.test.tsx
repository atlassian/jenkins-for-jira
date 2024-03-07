import {
	fireEvent, render, screen, waitFor
} from '@testing-library/react';
import { EventType, JenkinsServer } from '../../../../src/common/types';
import * as getAllJenkinsServersModule from '../../api/getAllJenkinsServers';
import * as fetchGlobalPageUrlModule from '../../api/fetchGlobalPageUrl';
import { AnalyticsScreenEventsEnum } from '../../common/analytics/analytics-events';
import { SharePage } from './SharePage';

const testJenkinsServer: JenkinsServer = {
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
};

jest.mock('../../api/fetchGlobalPageUrl');
jest.mock('../../api/redirectFromGetStarted');

describe('SharePage Component', () => {
	test('should copy to clipboard when "Copy to clipboard" is clicked', async () => {
		const mockWriteText = jest.fn().mockResolvedValueOnce(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			value: {
				writeText: mockWriteText
			}
		});
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([testJenkinsServer]);
		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

		await waitFor(() => render(<SharePage analyticsScreenEventNameEnum={AnalyticsScreenEventsEnum.JenkinsSetupScreenName}/>));
		await waitFor(() => fireEvent.click(screen.getByText('Share page')));
		await waitFor(() => fireEvent.click(screen.getByText('Copy to clipboard')));
		await waitFor(() => screen.getByText('Copied to clipboard'));
		expect(navigator.clipboard.writeText).toBeCalled();
	});

	test('should close the share modal when "Close" is clicked', async () => {
		jest.spyOn(getAllJenkinsServersModule, 'getAllJenkinsServers').mockResolvedValueOnce([testJenkinsServer]);
		jest.spyOn(fetchGlobalPageUrlModule, 'fetchGlobalPageUrl').mockResolvedValueOnce('https://somesite.atlassian.net/blah');

		await waitFor(() => render(<SharePage analyticsScreenEventNameEnum={AnalyticsScreenEventsEnum.JenkinsSetupScreenName}/>));
		await waitFor(() => fireEvent.click(screen.getByText('Share page')));

		expect(screen.getByText('Copy to clipboard')).toBeInTheDocument();

		await waitFor(() => screen.getByText('Close'));

		fireEvent.click(screen.getByText('Close'));

		await waitFor(() => {
			expect(screen.queryByText('Copy to clipboard')).not.toBeInTheDocument();
		});
	});
});
