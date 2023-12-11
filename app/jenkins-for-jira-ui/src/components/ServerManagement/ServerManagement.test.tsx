import React from 'react';
import { render } from '@testing-library/react';
import { ServerManagement } from './ServerManagement';

describe('ServerManagement', () => {
	test('should render loading icon when request is being made for servers', () => {
		const { getByText } = render(
			<ServerManagement />
		);

		expect(getByText('build')).toBeInTheDocument();
	});

	test('should render loading icon when request is being made for the moduleKey', () => {
		const { getByText } = render(
			<ServerManagement />
		);

		expect(getByText('build')).toBeInTheDocument();
	});

	test('should render ConnectionWizard when fetchAllJenkinsServers returns no servers', () => {
		const { getByText } = render(
			<ServerManagement />
		);

		expect(getByText('build')).toBeInTheDocument();
	});

	test('should render ConnectionPanel when fetchAllJenkinsServers returns servers', () => {
		const { getByText } = render(
			<ServerManagement />
		);

		expect(getByText('build')).toBeInTheDocument();
	});
});
