import React from 'react';
import {
	render, screen, fireEvent, waitFor
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { InProductHelpAction, InProductHelpActionButtonAppearance, InProductHelpActionType } from './InProductHelpAction';

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
							title: 'Search Results',
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

	test.only('should set loading state while searching', async () => {
		render(
			<InProductHelpAction
				label="Help"
				type={InProductHelpActionType.HelpLink}
				searchQuery="test"
			/>
		);
		const helpElement = screen.getByText(/Help/i);

		fireEvent.click(helpElement);
		expect(screen.getByText(/Loading/i)).toBeInTheDocument();
	});

	// // Test Case 6: Handles errors during search
	// test('handles errors during search', async () => {
	// 	// Mocking Algolia search function to simulate an error
	// 	jest.spyOn(console, 'error').mockImplementation(() => {});
	// 	const searchSpy = jest.fn(() => Promise.reject('Mocked Error'));
	// 	global.algoliasearch.initIndex = jest.fn(() => ({
	// 		search: searchSpy
	// 	}));
	//
	// 	render(
	// 		<InProductHelpAction
	// 			label="Help"
	// 			type={InProductHelpActionType.HelpLink}
	// 			searchQuery="test"
	// 		/>
	// 	);
	// 	const helpElement = screen.getByText(/Help/i);
	//
	// 	fireEvent.click(helpElement);
	// 	await waitFor(() => {
	// 		expect(console.error).toHaveBeenCalledWith('Error searching Algolia index:', 'Mocked Error');
	// 	});
	//
	// 	// Restore the console.error function
	// 	console.error.mockRestore();
	// });

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

		const { body } = document;
		fireEvent.mouseDown(body);

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

	test('should set the correct class based on appearance prop', () => {
		render(
			<InProductHelpAction
				label="Help"
				type={InProductHelpActionType.HelpLink}
				appearance={InProductHelpActionButtonAppearance.Primary}
				searchQuery=""
			/>
		);
		const helpElement = screen.getByText(/Help/i);

		expect(helpElement).toHaveClass('inProductHelpActionButtonPrimary');
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
