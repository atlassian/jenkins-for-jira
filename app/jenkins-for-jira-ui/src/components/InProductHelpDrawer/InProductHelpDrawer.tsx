import React from 'react';
import Drawer from '@atlaskit/drawer';

export type Hit = {
	objectID: number,
	title: string
};

export type SearchState = {
	query: string,
	hits: Hit[]
};

// type Hits = {
// 	id: string,
// 	body: string,
// 	objectID: string,
// 	title: string
// };

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
					? <div>add loader...</div>
					: <div dangerouslySetInnerHTML={{ __html: results[0].body || results[0].bodyText }} />
			}
		</Drawer>
	);
};
