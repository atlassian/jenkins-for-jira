import React from 'react';
import { render, screen } from '@testing-library/react';
import moment from 'moment';
import '@testing-library/jest-dom/extend-expect';
import { ConnectedJenkinsServers, timeFromNow } from './ConnectedJenkinsServers';
import { EventType, JenkinsServer } from '../../../../src/common/types';

describe('timeFromNow util', () => {
	test('returns correct string for hours', () => {
		const date = moment().subtract(5, 'hours');
		const result = timeFromNow(date);
		expect(result).toEqual('About 5 hours ago');
	});

	test('returns correct string for single hour', () => {
		const date = moment().subtract(1, 'hours');
		const result = timeFromNow(date);
		expect(result).toEqual('About 1 hour ago');
	});

	test('returns correct string for minutes', () => {
		const date = moment().subtract(30, 'minutes');
		const result = timeFromNow(date);
		expect(result).toEqual('About 30 minutes ago');
	});

	test('returns correct string for single minute', () => {
		const date = moment().subtract(1, 'minutes');
		const result = timeFromNow(date);
		expect(result).toEqual('About 1 minute ago');
	});

	test('returns correct string for seconds', () => {
		const date = moment().subtract(45, 'seconds');
		const result = timeFromNow(date);
		expect(result).toEqual('About 45 seconds ago');
	});

	test('returns correct string for single second', () => {
		const date = moment().subtract(1, 'seconds');
		const result = timeFromNow(date);
		expect(result).toEqual('About 1 second ago');
	});
});

describe('ConnectedJenkinsServers suite', () => {
	const mockConnectedJenkinsServer: JenkinsServer = {
		name: 'mockServer',
		uuid: '123',
		pipelines: [
			{
				name: 'mockPipeline',
				lastEventStatus: 'successful',
				lastEventType: EventType.DEPLOYMENT,
				lastEventDate: new Date()
			}
		]
	};

	test('renders column headers', () => {
		render(<ConnectedJenkinsServers connectedJenkinsServer={mockConnectedJenkinsServer} />);
		expect(screen.getByText('Pipeline')).toBeInTheDocument();
		expect(screen.getByText('Event')).toBeInTheDocument();
		expect(screen.getByText('Received')).toBeInTheDocument();
	});

	test('renders correct job & event content', () => {
		render(<ConnectedJenkinsServers connectedJenkinsServer={mockConnectedJenkinsServer} />);
		expect(screen.getByText(mockConnectedJenkinsServer.pipelines[0].name)).toBeInTheDocument();
		expect(screen.getByText('successful deployment')).toBeInTheDocument();
	});

	test('renders correct time content', () => {
		render(<ConnectedJenkinsServers connectedJenkinsServer={mockConnectedJenkinsServer} />);
		const timeContent = moment().diff(moment(new Date(mockConnectedJenkinsServer.pipelines[0].lastEventDate)), 'hours') < 24
			? timeFromNow(new Date(mockConnectedJenkinsServer.pipelines[0].lastEventDate))
			: moment(new Date(mockConnectedJenkinsServer.pipelines[0].lastEventDate)).format('Do MMMM YYYY [at] hh:mma');
		expect(screen.getByText(timeContent)).toBeInTheDocument();
	});
});
