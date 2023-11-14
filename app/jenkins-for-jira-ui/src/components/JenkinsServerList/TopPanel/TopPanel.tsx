import React from 'react';
import { cx } from '@emotion/css';
import {
	TopPanelContainer,
	TopPanelContent,
	TopPanelContentHeader,
	TopPanelImg,
	TopPanelImgContainer
} from './TopPanel.styles';
import PlugInImage from '../../assets/PlugIn.svg';

const TopPanel = (): JSX.Element => {
	return (
		<div className={cx(TopPanelContainer)}>
			<div>
				<h2 className={cx(TopPanelContentHeader)}>Server management</h2>
				<p className={cx(TopPanelContent)}>Jenkins for Jira lets your teams <u>keep track of code
					they build and deploy</u> on Jenkins <br /> servers.</p>
				{/* TODO - add link */}
				<p className={cx(TopPanelContent)}>Follow the <strong>set up guide</strong> for each server to
					receive build and deployment data.</p>
			</div>
			<div className={cx(TopPanelImgContainer)}>
				<img className={cx(TopPanelImg)} src={PlugInImage} alt="Connect Jenkins with Jira"/>
			</div>
		</div>
	);
};

export { TopPanel };
