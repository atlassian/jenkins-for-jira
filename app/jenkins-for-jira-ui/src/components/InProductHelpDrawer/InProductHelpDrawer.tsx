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

export type InProductHelpDrawerProps = {
	isDrawerOpen: boolean,
	setIsDrawerOpen(isDrawerOpen: boolean): void,
	hits: Hit[]
};

export const InProductHelpDrawer = ({
	isDrawerOpen,
	setIsDrawerOpen,
	hits
}: InProductHelpDrawerProps): JSX.Element => {
	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	console.log('hits:', hits);

	return (
		<Drawer
			onClose={closeDrawer}
			isOpen={isDrawerOpen}
			width="wide"
			label="Basic drawer"
		>
			<div>Add content here for each link item</div>
		</Drawer>
	);
};
