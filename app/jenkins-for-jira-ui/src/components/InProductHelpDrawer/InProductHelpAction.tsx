import React, { useState } from 'react';
import { cx } from '@emotion/css';
import { inProductHelpActionButton, inProductHelpActionLink } from './InProductHelp.styles';
import { InProductHelpDrawer } from './InProductHelpDrawer';

export enum InProductHelpActionType {
	HelpLink = 'link',
	HelpButton = 'button'
}

type InProductHelpActionProps = {
	label: string,
	type: InProductHelpActionType
};

export const InProductHelpAction = ({
	label,
	type
}: InProductHelpActionProps): JSX.Element => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const inProductHelpTypeClassName =
		type === InProductHelpActionType.HelpLink ? inProductHelpActionLink : inProductHelpActionButton;
	const actionRole = InProductHelpActionType.HelpLink ? 'link' : 'button';

	const openDrawer = () => {
		setIsDrawerOpen(true);
	};

	return (
		<>
			<span
				role={actionRole}
				className={cx(inProductHelpTypeClassName)}
				onClick={(e) => {
					e.preventDefault();
					openDrawer();
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						openDrawer();
					}
				}}
				tabIndex={0}
			>
				{label}
			</span>
			<InProductHelpDrawer
				isDrawerOpen={isDrawerOpen}
				setIsDrawerOpen={setIsDrawerOpen}
			/>
		</>
	);
};
