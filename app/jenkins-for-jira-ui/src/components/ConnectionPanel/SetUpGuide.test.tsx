import React from 'react';
import { render } from '@testing-library/react';
import { PipelineEventType, SetUpGuideInstructions } from './SetUpGuide';

describe('SetUpGuideInstructions', () => {
	test('should render SetUpGuideInstructions with BUILD eventType, globalSettings, and regex', () => {
		const { getByText } = render(
			<SetUpGuideInstructions
				eventType={PipelineEventType?.BUILD}
				globalSettings
				regex="^build$"
			/>
		);

		expect(getByText('jiraSendBuildInfo')).toBeInTheDocument();
		expect(getByText('OR')).toBeInTheDocument();
		expect(getByText('^build$')).toBeInTheDocument();
	});

	test('should render SetUpGuideInstructions with BUILD eventType, globalSettings, and no regex', () => {
		const { getByText } = render(
			<SetUpGuideInstructions
				eventType={PipelineEventType?.BUILD}
				globalSettings
			/>
		);

		expect(getByText('No setup required')).toBeInTheDocument();
	});

	test('should render SetUpGuideInstructions with DEPLOYMENT eventType, globalSettings, and regex', () => {
		const { getByText } = render(
			<SetUpGuideInstructions
				eventType={PipelineEventType?.DEPLOYMENT}
				globalSettings
				regex="^deploy to (?<envName>.*)$"
			/>
		);

		expect(getByText('jiraSendDeploymentInfo')).toBeInTheDocument();
		expect(getByText('OR')).toBeInTheDocument();
		expect(getByText('^deploy to (?<envName>.*)$')).toBeInTheDocument();
	});

	test('should render SetUpGuideInstructions with DEPLOYMENT eventType, globalSettings set to false', () => {
		const { getByText, queryByText } = render(
			<SetUpGuideInstructions
				eventType={PipelineEventType?.DEPLOYMENT}
				globalSettings={false}
			/>
		);

		expect(getByText('jiraSendDeploymentInfo')).toBeInTheDocument();
		expect(queryByText('OR')).toBeNull();
	});
});
