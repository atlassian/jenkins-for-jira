import React from 'react';
import Drawer from '@atlaskit/drawer';

type InProductHelpDrawerProps = {
	isDrawerOpen: boolean,
	setIsDrawerOpen(isDrawerOpen: boolean): void
};

export const InProductHelpDrawer = ({ isDrawerOpen, setIsDrawerOpen }: InProductHelpDrawerProps): JSX.Element => {
	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	return (
		<Drawer
			onClose={closeDrawer}
			isOpen={isDrawerOpen}
			width="wide"
			label="Basic drawer"
		>
			{/* TODO - ARC-2737 Algolia implementation */}
			<div>Add content here for each link item</div>
		</Drawer>
	);
};
