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
		expect(linkElement.tagName).toBe('STRONG');
		expect(linkElement).toBeInTheDocument();
	});
});
