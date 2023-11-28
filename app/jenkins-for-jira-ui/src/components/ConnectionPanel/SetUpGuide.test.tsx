import React from 'react';
import { render } from '@testing-library/react';
import { PipelineEventType, SetUpGuideInstructions, SetUpGuideLink } from './SetUpGuide';

describe('SetUpGuideInstructions', () => {
	const onClickMock = jest.fn();

	test('renders SetUpGuideInstructions with BUILD eventType, globalSettings, and regex', () => {
		const { getByText } = render(
			<SetUpGuideInstructions
				onClick={onClickMock}
				eventType={PipelineEventType?.BUILD}
				globalSettings
				regex="^build$"
			/>
		);

		expect(getByText('jiraSendBuildInfo')).toBeInTheDocument();
		expect(getByText('OR')).toBeInTheDocument();
		expect(getByText('^build$')).toBeInTheDocument();
	});

	test('renders SetUpGuideInstructions with BUILD eventType, globalSettings, and no regex', () => {
		const { getByText } = render(
			<SetUpGuideInstructions
				onClick={onClickMock}
				eventType={PipelineEventType?.BUILD}
				globalSettings
			/>
		);

		expect(getByText('No setup required')).toBeInTheDocument();
	});

	test('renders SetUpGuideInstructions with DEPLOYMENT eventType, globalSettings, and regex', () => {
		const { getByText } = render(
			<SetUpGuideInstructions
				onClick={onClickMock}
				eventType={PipelineEventType?.DEPLOYMENT}
				globalSettings
				regex="^deploy to (?<envName>.*)$"
			/>
		);

		expect(getByText('jiraSendDeploymentInfo')).toBeInTheDocument();
		expect(getByText('OR')).toBeInTheDocument();
		expect(getByText('^deploy to (?<envName>.*)$')).toBeInTheDocument();
	});

	test('renders SetUpGuideInstructions with DEPLOYMENT eventType, globalSettings set to false', () => {
		const { getByText, queryByText } = render(
			<SetUpGuideInstructions
				onClick={onClickMock}
				eventType={PipelineEventType?.DEPLOYMENT}
				globalSettings={false}
			/>
		);

		expect(getByText('jiraSendDeploymentInfo')).toBeInTheDocument();
		expect(queryByText('OR')).toBeNull();
	});
});

describe('SetUpGuideLink', () => {
	const onClickMock = jest.fn();

	test('renders SetUpGuideLink with label', () => {
		const { getByText } = render(
			<SetUpGuideLink onClick={onClickMock} label="build" />
		);

		expect(getByText('build')).toBeInTheDocument();
	});
});
