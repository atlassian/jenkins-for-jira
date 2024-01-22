import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import Drawer from '@atlaskit/drawer';
import { cx } from '@emotion/css';
import Spinner from '@atlaskit/spinner';
// import { router } from '@forge/bridge';
import { router } from '@forge/bridge';
import { loadingContainer } from '../JenkinsSetup/JenkinsSetup.styles';
import { inProductHelpDrawerContainer, inProductHelpDrawerTitle } from './InProductHelp.styles';

const replaceAnchorsWithSpanElement = (content: string, searchQuery: string) => {
	const tempDiv = document.createElement('div');
	tempDiv.innerHTML = DOMPurify.sanitize(content);

	const anchorMap: { link?: string } = {};
	const anchorTags = tempDiv.getElementsByTagName('a');

	Array.from(anchorTags).forEach((anchorTag: HTMLAnchorElement) => {
		const linkSpan = document.createElement('span');
		linkSpan.id = `${searchQuery}`;
		linkSpan.className = 'iph-link';
		linkSpan.style.color = '#0C66E4';
		linkSpan.style.cursor = 'pointer';
		linkSpan.innerHTML = anchorTag.innerText;
		linkSpan.tabIndex = 0;
		anchorMap.link = anchorTag.href;

		// Replace the anchor tag with the span element
		anchorTag.parentNode?.replaceChild(linkSpan, anchorTag);
	});

	return { tempDiv, anchorMap };
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
};

export const InProductHelpDrawer = ({
	isDrawerOpen,
	setIsDrawerOpen,
	searchResults,
	isLoading,
	searchQuery
}: InProductHelpDrawerProps): JSX.Element => {
	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	const results = Array.isArray(searchResults) ? searchResults : searchResults.hits;
	const {
		tempDiv: tempDivBody,
		anchorMap: anchorMapBody
	} = (!isLoading && replaceAnchorsWithSpanElement(results[0].body, searchQuery)) as {
		tempDiv: HTMLDivElement;
		anchorMap: { link?: string };
	};

	const {
		tempDiv: tempDivBodyText,
		anchorMap: anchorMapBodyText
	} = (!isLoading && replaceAnchorsWithSpanElement(results[0].bodyText, searchQuery)) as {
		tempDiv: HTMLDivElement;
		anchorMap: { link?: string };
	};

	useEffect(() => {
		// Add a click event listener to the container after the component is mounted
		const container = document.getElementById(searchQuery);
		if (container) {
			container.addEventListener('click', (e) => {
				const clickedElement = e.target as HTMLElement;

				if (clickedElement.className === 'iph-link') {
					e.preventDefault();

					if (anchorMapBody.link) {
						const url = anchorMapBody.link;
						router.open(url);
					}

					if (anchorMapBodyText.link) {
						const url = anchorMapBodyText.link;
						router.open(url);
					}
				}
			});
		}
	}, [searchQuery, anchorMapBody, anchorMapBodyText]);

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
