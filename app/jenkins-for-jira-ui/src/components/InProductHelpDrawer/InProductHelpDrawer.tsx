import React from 'react';
import Drawer from '@atlaskit/drawer';
import { Hit } from '../../hooks/old';

export type InProductHelpDrawerProps = {
	isDrawerOpen: boolean,
	setIsDrawerOpen(isDrawerOpen: boolean): void,
	hits: Hit[],
	indexName?: string
};

export const InProductHelpDrawer = ({
	isDrawerOpen,
	setIsDrawerOpen,
	hits,
	indexName
}: InProductHelpDrawerProps): JSX.Element => {
	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	console.log(hits);

	return (
		<Drawer
			onClose={closeDrawer}
			isOpen={isDrawerOpen}
			width="wide"
			label="Basic drawer"
		>
			<div>Add content here for each link item {indexName}</div>
		</Drawer>
	);
};
