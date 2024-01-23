import React, { useCallback, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import Drawer from '@atlaskit/drawer';
import { cx } from '@emotion/css';
import Spinner from '@atlaskit/spinner';
import { router } from '@forge/bridge';
import { loadingContainer } from '../JenkinsSetup/JenkinsSetup.styles';
import { inProductHelpDrawerContainer, inProductHelpDrawerTitle } from './InProductHelp.styles';
import { getIdForLinkInIphDrawer } from './InProductHelpIds';
import { EXTERNAL_LINK_IPH_TEXT, HELP_LINK } from '../../common/constants';

const openUrlInNewTab = () => {
	const url = HELP_LINK;
	router.open(url);
};

const addAttributesToSpanElement =
	(linkSpan: HTMLSpanElement, anchorTag: HTMLAnchorElement, anchorMap: { link?: string }) => {
		linkSpan.className = 'iph-link';
		linkSpan.style.color = '#0C66E4';
		linkSpan.style.cursor = 'pointer';
		linkSpan.innerHTML = anchorTag.innerText;
		linkSpan.tabIndex = 0;
		anchorMap.link = anchorTag.href;
	};

const replaceAnchorsWithSpanElement = (content: string) => {
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = DOMPurify.sanitize(content);

	const anchorMap: { link?: string } = {};
	const anchorTags = tempDiv.getElementsByTagName('a');

	Array.from(anchorTags).forEach((anchorTag: HTMLAnchorElement) => {
		const linkSpan = document.createElement('span');
		addAttributesToSpanElement(linkSpan, anchorTag, anchorMap);
		anchorTag.parentNode?.replaceChild(linkSpan, anchorTag);
	});

	return { tempDiv, anchorMap };
};

const mapInnerIphLinks = (
	containers: HTMLCollectionOf<Element>,
	setIsDrawerOpen: (isOpen: boolean) => void,
	setInnerSearchQuery: (query: string) => void,
	search: (query: string) => void
) => {
	Array.from(containers).forEach((container) => {
		if (container instanceof HTMLElement) {
			container.addEventListener('click', (e) => {
				const clickedElement = e.target as HTMLElement;
				const linkText = clickedElement.innerHTML.toLowerCase();

				if (linkText === EXTERNAL_LINK_IPH_TEXT) {
					setIsDrawerOpen(false);
					openUrlInNewTab();
				} else {
					e.preventDefault();
					const iphDrawerLinkId = getIdForLinkInIphDrawer(linkText);
					setInnerSearchQuery(iphDrawerLinkId);
					search(iphDrawerLinkId);
				}
			});
		}
	});
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
	isLoading: boolean,
	searchQuery: string,
	setIsLoading(isLoading: boolean): void,
	setSearchResults(hits: Hit[]): void,
	index: {
		search<T>(query: string): Promise<{ hits: T[] }>
	}
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
	const [innerSearchQuery, setInnerSearchQuery] = useState<string>('');
	const closeDrawer = (e: React.SyntheticEvent<HTMLElement, Event>) => {
		e.preventDefault();
		const target = e.target as HTMLElement;

		if (innerSearchQuery && target.role !== 'presentation') {
			setInnerSearchQuery('');
			search(searchQuery);
		} else {
			setIsDrawerOpen(false);
		}
	};

	const results = Array.isArray(searchResults) ? searchResults : searchResults.hits;

	const {
		tempDiv: tempDivBody
	} = (!isLoading && replaceAnchorsWithSpanElement(results[0].body)) as {
		tempDiv: HTMLDivElement;
	};

	const {
		tempDiv: tempDivBodyText
	} = (!isLoading && replaceAnchorsWithSpanElement(results[0].bodyText)) as {
		tempDiv: HTMLDivElement;
	};

	const search = useCallback(async (searchId: string) => {
		setIsLoading(true);

		if (innerSearchQuery && innerSearchQuery.trim() === '') {
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
	}, [index, setSearchResults, innerSearchQuery, setIsLoading]);

	useEffect(() => {
		const containers = document.getElementsByClassName('iph-link');
		mapInnerIphLinks(containers, setIsDrawerOpen, setInnerSearchQuery, search);
	}, [search, setIsDrawerOpen]);

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
