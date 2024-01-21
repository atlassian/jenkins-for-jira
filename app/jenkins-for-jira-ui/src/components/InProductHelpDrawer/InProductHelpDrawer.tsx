import React from 'react';
import DOMPurify from 'dompurify';
import Drawer from '@atlaskit/drawer';
import { cx } from '@emotion/css';
import Spinner from '@atlaskit/spinner';
// import Button from '@atlaskit/button/standard-button';
import { router } from '@forge/bridge';
import { loadingContainer } from '../JenkinsSetup/JenkinsSetup.styles';
import { inProductHelpDrawerContainer, inProductHelpDrawerTitle } from './InProductHelp.styles';

const replaceAnchorsWithButtons = (content: string) => {
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = DOMPurify.sanitize(content);

	const anchorTags = tempDiv.getElementsByTagName('a');

	Array.from(anchorTags).forEach((anchorTag: HTMLAnchorElement) => {
		const linkButton = document.createElement('button');
		linkButton.innerHTML = DOMPurify.sanitize(anchorTag.innerText);
		linkButton.addEventListener('click', (e) => {
			e.preventDefault();
			router.open(anchorTag.href);
		});

		// Replace the anchor tag with the link button
		anchorTag.parentNode?.replaceChild(linkButton, anchorTag);
	});

	return tempDiv.innerHTML;
};

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
											__html: DOMPurify.sanitize(replaceAnchorsWithButtons(results[0].body)) ||
												DOMPurify.sanitize(replaceAnchorsWithButtons(results[0].bodyText))
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
