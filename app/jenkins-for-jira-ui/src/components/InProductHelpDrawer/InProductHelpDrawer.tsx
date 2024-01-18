import React from 'react';
import DOMPurify from 'dompurify';
import Drawer from '@atlaskit/drawer';
import { cx } from '@emotion/css';
import Spinner from '@atlaskit/spinner';
import { loadingContainer } from '../JenkinsSetup/JenkinsSetup.styles';
import { inProductHelpDrawerContainer, inProductHelpDrawerTitle } from './InProductHelp.styles';

export type Hit = {
	id: string,
	body?: string,
	bodyText?: string,
	objectID: string,
	title: string
};

export type InProductHelpDrawerProps = {
	isDrawerOpen: boolean,
	setIsDrawerOpen(isDrawerOpen: boolean): void,
	searchResults: any,
	isLoading: boolean
};

export const InProductHelpDrawer = ({
	isDrawerOpen,
	setIsDrawerOpen,
	searchResults,
	isLoading
}: InProductHelpDrawerProps): JSX.Element => {
	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	const results = Array.isArray(searchResults)
		? searchResults
		: searchResults.hits;

	console.log('hits:', results);

	return (
		<Drawer
			onClose={closeDrawer}
			isOpen={isDrawerOpen}
			width="wide"
			label="Basic drawer"
		>
			{
				isLoading
					? <div className={cx(loadingContainer)} data-testid="loading-spinner">
						<Spinner size='large' />
					</div>
					: <div className={cx(inProductHelpDrawerContainer)}>
						{
							results.length
								? <>
									<h3 className={cx(inProductHelpDrawerTitle)}>{results[0].title}</h3>
									<div
										dangerouslySetInnerHTML={{
											__html: DOMPurify.sanitize(results[0].body) ||
												DOMPurify.sanitize(results[0].bodyText)
										}}
									/>
								</>
								: <></>
						}
					</div>
			}
		</Drawer>
	);
};
