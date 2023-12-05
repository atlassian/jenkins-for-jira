import React from 'react';
import { cx } from '@emotion/css';
import {
	topPanelContainer,
	topPanelContent,
	topPanelContentHeader,
	topPanelContentHeaderContainer,
	topPanelImgContainer,
	topPanelImg
} from '../ServerManagement.styles';
import { PluginIcon } from '../../icons/PluginIcon';

const TopPanel = (): JSX.Element => {
	return (
		<div className={cx(topPanelContainer)}>
			<div className={cx(topPanelContentHeaderContainer)}>
				<h2 className={cx(topPanelContentHeader)}>Server management</h2>
				{/* TODO - add link/drawer (will be done after I investigate 'proper' drawer usage) */}
				<p className={cx(topPanelContent)}>Jenkins for Jira lets your teams <u>keep track of code
					they build and deploy</u> on Jenkins servers.</p>
				{/* TODO - add link/drawer (will be done after I investigate 'proper' drawer usage) */}
				<p className={cx(topPanelContent)}>Follow the <strong>set up guide</strong> for each server to
					receive build and deployment data.</p>
			</div>
			<PluginIcon containerClassName={topPanelImgContainer} svgClassName={topPanelImg}/>
		</div>
	);
};

export { TopPanel };
