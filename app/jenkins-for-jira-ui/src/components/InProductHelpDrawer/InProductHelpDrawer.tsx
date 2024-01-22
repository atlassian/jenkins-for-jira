import React, { useCallback, useEffect } from 'react';
import DOMPurify from 'dompurify';
import Drawer from '@atlaskit/drawer';
import { cx } from '@emotion/css';
import Spinner from '@atlaskit/spinner';
import { loadingContainer } from '../JenkinsSetup/JenkinsSetup.styles';
import { inProductHelpDrawerContainer, inProductHelpDrawerTitle } from './InProductHelp.styles';
import { InProductHelpIds } from './InProductHelpIds';

const replaceAnchorsWithSpanElement = (content: string, searchQuery: string) => {
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = DOMPurify.sanitize(content);

	const anchorTags = tempDiv.getElementsByTagName('a');

	Array.from(anchorTags).forEach((anchorTag: HTMLAnchorElement) => {
		const linkSpan = document.createElement('span');
		linkSpan.id = `${searchQuery}`;
		linkSpan.className = 'iph-link';
		linkSpan.style.color = '#0C66E4';
		linkSpan.style.cursor = 'pointer';
		linkSpan.innerHTML = anchorTag.innerText;
		linkSpan.tabIndex = 0;

		// Replace the anchor tag with the span element
		anchorTag.parentNode?.replaceChild(linkSpan, anchorTag);
	});

	return { tempDiv };
};

export type Hit = {
	id: string;
	body?: string;
	bodyText?: string;
	objectID: string;
	title: string;
};

export type InProductHelpDrawerProps = {
	isDrawerOpen: boolean;
	setIsDrawerOpen(isDrawerOpen: boolean): void;
	searchResults: any;
	isLoading: boolean;
	searchQuery: string;
	setIsLoading(isLoading: boolean): void,
	setSearchResults(hits: Hit[]): void,
	index: {
		search<T>(query: string): Promise<{ hits: T[] }>;
	};
};

export const InProductHelpDrawer = ({
	isDrawerOpen,
	setIsDrawerOpen,
	searchResults,
	isLoading,
	searchQuery,
	setIsLoading,
	setSearchResults,
	index
}: InProductHelpDrawerProps): JSX.Element => {
	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	const results = Array.isArray(searchResults) ? searchResults : searchResults.hits;
	const {
		tempDiv: tempDivBody
	} = (!isLoading && replaceAnchorsWithSpanElement(results[0].body, searchQuery)) as {
		tempDiv: HTMLDivElement;
	};

	const {
		tempDiv: tempDivBodyText
	} = (!isLoading && replaceAnchorsWithSpanElement(results[0].bodyText, searchQuery)) as {
		tempDiv: HTMLDivElement;
	};

	const search = useCallback(async (searchId: string) => {
		setIsLoading(true);

		if (searchQuery.trim() === '') {
			setSearchResults([]);
			return;
		}

		try {
			const subsequentResults = await index.search<Hit>(searchId);
			const hitsData: Hit[] = subsequentResults.hits.map((hit: Hit) => ({
				id: hit.objectID,
				objectID: hit.objectID,
				title: hit.title,
				body: hit.body || '',
				bodyText: hit.bodyText || ''
			}));

			setSearchResults(hitsData);
			setIsLoading(false);
		} catch (e) {
			console.error('Error searching Algolia index:', e);
			setIsLoading(false);
		}
	}, [index, setSearchResults, searchQuery, setIsLoading]);

	useEffect(() => {
		// Add a click event listener to the container after the component is mounted
		const container = document.getElementById(searchQuery);
		if (container) {
			container.addEventListener('click', (e) => {
				const clickedElement = e.target as HTMLElement;

				if (clickedElement.className === 'iph-link') {
					e.preventDefault();
					search(InProductHelpIds.SET_UP_GUIDE_NO_SET_UP_REQUIRED);
				}
			});
		}
	}, [searchQuery, search]);

	return (
		<Drawer onClose={closeDrawer} isOpen={isDrawerOpen} width="wide" label="Basic drawer">
			{isLoading ? (
				<div className={cx(loadingContainer)} data-testid="loading-spinner">
					<Spinner size="large" />
				</div>
			) : (
				<div className={cx(inProductHelpDrawerContainer)}>
					{results.length ? (
						<>
							<h3 className={cx(inProductHelpDrawerTitle)}>{results[0].title}</h3>
							<div
								dangerouslySetInnerHTML={{
									__html: tempDivBody.innerHTML || tempDivBodyText.innerHTML || ''
								}}
							/>
						</>
					) : (
						<></>
					)}
				</div>
			)}
		</Drawer>
	);
};
