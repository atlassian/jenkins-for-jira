import React from 'react';
import { cx } from '@emotion/css';
import { JenkinsServer } from '../../../../src/common/types';
import { connectedStateContainer } from './ConnectionPanel.styles';

type ConnectedStateProps = {
	connectedJenkinsServers: JenkinsServer[]
};

const ConnectedJenkinsServers = ({ connectedJenkinsServers }: ConnectedStateProps): JSX.Element => {
	console.log('connectedJenkinsServers: ', connectedJenkinsServers);
	return (
		<div className={cx(connectedStateContainer)}>
			render table here
		</div>
	);
};

export { ConnectedJenkinsServers };
