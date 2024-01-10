import React from 'react';
import { cx } from '@emotion/css';
import PeopleGroup from '@atlaskit/icon/glyph/people-group';
import { InProductHelpAction, InProductHelpActionType } from '../InProductHelpDrawer/InProductHelpAction';
import { infoPanelContainer } from './InfoPanel.styles';

type InfoPanelProps = {
	content: string,
	iphContainerWidth?: string,
	iphLabel: string,
	iphType: InProductHelpActionType
};

const InfoPanel = ({
	content, iphContainerWidth, iphLabel, iphType
}: InfoPanelProps) => {
	return (
		<div className={cx(infoPanelContainer)} style={{ width: iphContainerWidth }}>
			<PeopleGroup label="people-group" />

			<p>{content}&nbsp;
				<InProductHelpAction
					label={iphLabel}
					type={iphType}
				/>
			</p>
		</div>
	);
};

export { InfoPanel };
