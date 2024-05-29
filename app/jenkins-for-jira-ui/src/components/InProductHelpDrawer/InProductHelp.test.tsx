import React from 'react';
import {
	render, screen, fireEvent, waitFor
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { InProductHelpAction, InProductHelpActionType } from './InProductHelpAction';
import { InProductHelpDrawer } from './InProductHelpDrawer';

jest.mock('algoliasearch', () => {
	return {
		__esModule: true,
		default: () => ({
			initIndex: jest.fn(() => ({
				search: jest.fn(() => Promise.resolve({
					hits: [
						{
							id: '12323445345',
							objectID: '12323445345',
							title: 'Search Results 1',
							body: '',
							bodyText: ''
						},
						{
							id: '22323445345',
							objectID: '22323445345',
							title: 'Search Results 2',
							body: '',
							bodyText: ''
						}

					]
				}))
			}))
		})
	};
});

describe('InProductHelpAction Suite', () => {
	test('should render with the provided label', () => {
		render(
			<InProductHelpAction
				label="Help"
				type={InProductHelpActionType.HelpLink}
				searchQuery=""
			/>
		);

		const helpElement = screen.getByText(/Help/i);
		expect(helpElement).toBeInTheDocument();
	});

	test('should open the drawer on click', async () => {
		render(
			<InProductHelpAction
				label="Help"
				type={InProductHelpActionType.HelpLink}
				searchQuery=""
			/>
		);

		const helpElement = screen.getByText(/Help/i);
		fireEvent.click(helpElement);

		await waitFor(() => {
			expect(screen.getByText(/Search Results/i)).toBeInTheDocument();
		});
	});

	test('should open the drawer on Enter key press', async () => {
		render(
			<InProductHelpAction
				label="Help"
				type={InProductHelpActionType.HelpLink}
				searchQuery=""
			/>
		);

		const helpElement = screen.getByText(/Help/i);
		fireEvent.keyDown(helpElement, { key: 'Enter', code: 'Enter' });

		await waitFor(() => {
			expect(screen.getByText(/Search Results/i)).toBeInTheDocument();
		});
	});

	test('should not open the drawer if searchQuery is empty', async () => {
		render(
			<InProductHelpAction
				label="Help"
				type={InProductHelpActionType.HelpLink}
				searchQuery=""
			/>
		);

		const helpElement = screen.getByText(/Help/i);
		fireEvent.click(helpElement);

		await waitFor(() => {
			expect(screen.queryByText(/Search Results/i)).toBeNull();
		});
	});

	test('should close the drawer when clicking outside of it', async () => {
		render(
			<InProductHelpAction
				label="Help"
				type={InProductHelpActionType.HelpLink}
				searchQuery=""
			/>
		);

		const helpElement = screen.getByText(/Help/i);
		fireEvent.click(helpElement);

		await waitFor(() => {
			expect(screen.getByText(/Search Results/i)).toBeInTheDocument();
		});

		const backButton = screen.getByRole('img');
		fireEvent.click(backButton);

		await waitFor(() => {
			expect(screen.queryByText(/Search Results/i)).toBeNull();
		});
	});

	test('should close the drawer when Escape key is pressed', async () => {
		render(
			<InProductHelpAction
				label="Help"
				type={InProductHelpActionType.HelpLink}
				searchQuery=""
			/>
		);

		const helpElement = screen.getByText(/Help/i);
		fireEvent.click(helpElement);

		await waitFor(() => {
			expect(screen.getByText(/Search Results/i)).toBeInTheDocument();
		});

		fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

		await waitFor(() => {
			expect(screen.queryByText(/Search Results/i)).toBeNull();
		});
	});

	test('should set correct role based on action type prop', () => {
		render(
			<InProductHelpAction
				label="Help"
				type={InProductHelpActionType.HelpLink}
				searchQuery=""
			/>
		);

		const helpElement = screen.getByText(/Help/i);
		expect(helpElement).toHaveAttribute('role', 'link');
	});
});

describe('InProductHelpDrawer Suite', () => {
	const setHasError = jest.fn();

	test('renders InProductHelpAction with label', () => {
		const { getByText } = render(
			<InProductHelpAction label="build" type={InProductHelpActionType.HelpButton} searchQuery="iphActionTest" />
		);

		expect(getByText('build')).toBeInTheDocument();
	});

	test('should render with loading spinner when isLoading is true', () => {
		render(
			<InProductHelpDrawer
				isDrawerOpen
				setIsDrawerOpen={() => {}}
				searchResults={[]}
				isLoading
				searchQuery=""
				setIsLoading={() => {}}
				setSearchResults={() => {}}
				index={{ search: () => Promise.resolve({ hits: [] }) }}
				hasError={false}
				setHasError={setHasError}
			/>
		);

		expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
	});

	test('should render with search results when not loading', async () => {
		render(
			<InProductHelpDrawer
				isDrawerOpen
				setIsDrawerOpen={() => {}}
				searchResults={[
					{id: '1', title: 'Result 1', body: 'Body 1', bodyText: 'Body Text 1'},
					{id: '2', title: 'Result 2', body: 'Body 2', bodyText: 'Body Text 2'}]}
				isLoading={false}
				searchQuery=""
				setIsLoading={() => {}}
				setSearchResults={() => {}}
				index={{ search: () => Promise.resolve({ hits: [] }) }}
				hasError={false}
				setHasError={setHasError}
			/>
		);

		await waitFor(() => {
			expect(screen.getByText('Result 2')).toBeInTheDocument();
			expect(screen.getByText('Body 2')).toBeInTheDocument();
		});
	});

	test('should render error component when there is an error', async () => {
		render(
			<InProductHelpDrawer
				isDrawerOpen
				setIsDrawerOpen={() => {}}
				searchResults={[]}
				isLoading={false}
				searchQuery=""
				setIsLoading={() => {}}
				setSearchResults={() => {}}
				index={{ search: () => Promise.resolve({ hits: [] }) }}
				hasError={true}
				setHasError={setHasError}
			/>
		);

		await waitFor(() => {
			expect(screen.getByText('Content not found')).toBeInTheDocument();
		});
	});
});
