import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TopPanel } from './TopPanel';

describe('TopPanel Component', () => {
	test('renders without errors', () => {
		render(<TopPanel />);
	});

	test('renders correct header text', () => {
		const { getByText } = render(<TopPanel />);
		const headerElement = getByText('Server management');
		expect(headerElement).toBeInTheDocument();
	});

	test('renders set up guide link', () => {
		const { getByText } = render(<TopPanel />);
		const linkElement = getByText('set up guide');
		expect(linkElement).toBeInTheDocument();
	});

	test('renders strong tag for "set up guide"', () => {
		const { getByText } = render(<TopPanel />);
		const strongElement = getByText('set up guide');
		expect(strongElement.tagName).toBe('STRONG');
	});

	test('renders image with alt text', () => {
		const { getByAltText } = render(<TopPanel />);
		const imageElement = getByAltText('Connect Jenkins with Jira');
		expect(imageElement).toBeInTheDocument();
	});
});
