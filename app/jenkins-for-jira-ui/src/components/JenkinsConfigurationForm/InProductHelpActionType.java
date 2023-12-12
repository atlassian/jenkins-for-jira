import React from 'react';
import { cx } from '@emotion/css';
import { setUpGuideLink } from '../ConnectionPanel/ConnectionPanel.styles';

export const InProductHelpDraw = (): JSX.Element => {
	const inProductHelpTypeClassName = type === InProductHelpActionType.Link ? setUpGuideLink : '';

	return (
		<button className={cx(inProductHelpTypeClassName)} onClick={onClick}>
			{label}
		</button>
	);
};
