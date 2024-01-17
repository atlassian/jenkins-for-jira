import React from 'react';
import { cx } from '@emotion/css';
import PeopleGroup from '@atlaskit/icon/glyph/people-group';
import { InProductHelpAction, InProductHelpActionType } from '../InProductHelpDrawer/InProductHelpAction';
import { infoPanelContainer } from './InfoPanel.styles';

type InfoPanelProps = {
	content: string,
	iphContainerWidth?: string,
	iphLabel: string,
	iphType: InProductHelpActionType,
	screenName: string
};

const InfoPanel = ({
	content, iphContainerWidth, iphLabel, iphType, screenName
}: InfoPanelProps) => {
	return (
		<div className={cx(infoPanelContainer)} style={{ width: iphContainerWidth }}>
			<PeopleGroup label="people-group" />

			<p>{content}&nbsp;
				<InProductHelpAction
					label={iphLabel}
					type={iphType}
					indexName={iphLabel}
					screenName={screenName}
				/>
			</p>
		</div>
	);
};

export { InfoPanel };
