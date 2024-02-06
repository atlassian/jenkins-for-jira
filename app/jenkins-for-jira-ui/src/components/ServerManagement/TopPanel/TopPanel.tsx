import React from 'react';
import { cx } from '@emotion/css';
import {
	topPanelContainer,
	topPanelContent,
	topPanelContentHeaderContainer,
	topPanelImgContainer,
	topPanelImg
} from '../ServerManagement.styles';
import { PluginIcon } from '../../icons/PluginIcon';

const TopPanel = (): JSX.Element => {
	return (
		<div className={cx(topPanelContainer)}>
			<div className={cx(topPanelContentHeaderContainer)}>
				<p className={cx(topPanelContent)}>
					To receive build and deployment data, sdfsfsdfsdfyour teams must
					follow the unique setup guide for each connected server.
				</p>
			</div>
			<PluginIcon containerClassName={topPanelImgContainer} svgClassName={topPanelImg}/>
		</div>
	);
};

export { TopPanel };
