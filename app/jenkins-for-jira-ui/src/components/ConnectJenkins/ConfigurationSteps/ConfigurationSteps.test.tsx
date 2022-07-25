import { render, screen } from '@testing-library/react';
import { ConfigurationSteps } from './ConfigurationSteps';

describe('ConfigurationSteps Page Suite', () => {
	const { getByText } = screen;

	it('Should render three stages', () => {
		render(<ConfigurationSteps currentStage="install" />);
		expect(getByText('Install plugin')).toBeInTheDocument();
		expect(getByText('Create server')).toBeInTheDocument();
		expect(getByText('Connect server')).toBeInTheDocument();
	});

	it('Should render correctly with install as currentStage', () => {
		const container = render(<ConfigurationSteps currentStage="install" />);
		const InstallJenkinsStep = getByText('Install plugin');
		const CreateJenkinsStep = getByText('Create server');
		const ConnectJenkinsStep = getByText('Connect server');

		expect(InstallJenkinsStep).toHaveAttribute('style', 'color: rgb(0, 101, 255); font-weight: 600;');
		expect(CreateJenkinsStep).toHaveAttribute('style', 'color: rgb(94, 108, 132); font-weight: 400;');
		expect(ConnectJenkinsStep).toHaveAttribute('style', 'color: rgb(94, 108, 132); font-weight: 400;');
		expect(container).toMatchSnapshot();
	});

	it('Should render correctly with create as currentStage', () => {
		const container = render(<ConfigurationSteps currentStage="create" />);
		const InstallJenkinsStep = getByText('Install plugin');
		const CreateJenkinsStep = getByText('Create server');
		const ConnectJenkinsStep = getByText('Connect server');

		expect(InstallJenkinsStep).toBeInTheDocument();
		expect(CreateJenkinsStep).toHaveAttribute('style', 'color: rgb(0, 101, 255); font-weight: 600;');
		expect(ConnectJenkinsStep).toHaveAttribute('style', 'color: rgb(94, 108, 132); font-weight: 400;');
		expect(container).toMatchSnapshot();
	});

	it('Should render correctly with connect as currentStage', () => {
		const container = render(<ConfigurationSteps currentStage="connect" />);
		const InstallJenkinsStep = getByText('Install plugin');
		const CreateJenkinsStep = getByText('Create server');
		const ConnectJenkinsStep = getByText('Connect server');

		expect(InstallJenkinsStep).toBeInTheDocument();
		expect(CreateJenkinsStep).toBeInTheDocument();
		expect(ConnectJenkinsStep).toHaveAttribute('style', 'color: rgb(0, 101, 255); font-weight: 600;');
		expect(container).toMatchSnapshot();
	});
});
