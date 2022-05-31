import { render } from '@testing-library/react';
import { FailedIcon } from './FailedIcon';
import { InProgressIcon } from './InProgressIcon';
import { JenkinsIcon } from './JenkinsIcon';
import { RolledBackIcon } from './RolledBackIcon';
import { CancelledIcon } from './CancelledIcon';

describe('Icons Suite', () => {
	it('Should render cancelled icon', () => {
		const wrapper = render(<CancelledIcon />);
		const { getByTestId } = wrapper;
		expect(getByTestId('cancelledIcon')).toBeInTheDocument();
		expect(wrapper.container).toMatchSnapshot();
	});

	it('Should render failed icon', () => {
		const wrapper = render(<FailedIcon />);
		const { getByTestId } = wrapper;
		expect(getByTestId('failedIcon')).toBeInTheDocument();
		expect(wrapper.container).toMatchSnapshot();
	});

	it('Should render in-progress icon', () => {
		const wrapper = render(<InProgressIcon />);
		const { getByTestId } = wrapper;
		expect(getByTestId('inProgressIcon')).toBeInTheDocument();
		expect(wrapper.container).toMatchSnapshot();
	});

	it('Should render Jenkins icon', () => {
		const wrapper = render(<JenkinsIcon data-testid="jenkins-icon-connect"/>);
		const { getByTestId } = wrapper;
		expect(getByTestId('jenkins-icon-connect')).toBeInTheDocument();
		expect(wrapper.container).toMatchSnapshot();
	});

	it('Should render rolled back icon', () => {
		const wrapper = render(<RolledBackIcon />);
		const { getByTestId } = wrapper;
		expect(getByTestId('rolledBackIcon')).toBeInTheDocument();
		expect(wrapper.container).toMatchSnapshot();
	});
});
