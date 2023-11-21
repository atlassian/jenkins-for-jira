import React from 'react';
import moment from 'moment/moment';
import { cx } from '@emotion/css';
import DynamicTable from '@atlaskit/dynamic-table';
import { JenkinsPipeline, JenkinsServer } from '../../../../src/common/types';
import {
	mapLastEventStatus,
	mapLastEventStatusIcons
} from '../JenkinsServerList/ConnectedServer/ConnectedServers';
import {
	connectedStateCell,
	connectedStateCellContainer, connectedStateCellEvent,
	connectedStateContainer
} from './ConnectionPanel.styles';

type ConnectedStateProps = {
	connectedJenkinsServer: JenkinsServer
};

const ConnectedJenkinsServers = ({ connectedJenkinsServer }: ConnectedStateProps): JSX.Element => {
	const tableHead = () => {
		return {
			cells: [
				{
					key: 'job',
					content: 'Pipeline'
				},
				{
					key: 'event',
					content: 'Event'
				},
				{
					key: 'time',
					content: 'Received'
				}
			]
		};
	};

	const rows = (serverName: string, serverId: string, pipelines: JenkinsPipeline[] = []) => {
		return (
			pipelines.map((pipeline) => ({
				cells: [
					{
						key: 'job',
						content: (
							<div className={cx(connectedStateCellContainer)}>
								<div className={cx(connectedStateCell)}>
									{pipeline.name}
								</div>
							</div>
						)
					},
					{
						key: 'event',
						content: (
							<div className={cx(connectedStateCellContainer)}>
								<>
									<div className={cx(connectedStateCell)}>
										{mapLastEventStatusIcons(pipeline.lastEventStatus)}
									</div>
								</>
								<div className={cx(connectedStateCell, connectedStateCellEvent)}>
									{mapLastEventStatus(pipeline.lastEventStatus)} {pipeline.lastEventType}
								</div>
							</div>
						)
					},
					{
						key: 'time',
						content: (
							<div className={cx(connectedStateCellContainer)}>
								<div className={cx(connectedStateCell)}>
									{moment(new Date(pipeline.lastEventDate)).format('Do MMMM YYYY [at] hh:mma')}
								</div>
							</div>
						)
					}
				]
			}))
		);
	};

	return (
		<div className={cx(connectedStateContainer)}>
			<DynamicTable
				head={tableHead()}
				rows={rows(connectedJenkinsServer.name, connectedJenkinsServer.uuid, connectedJenkinsServer.pipelines)}
				loadingSpinnerSize='large'
			/>
		</div>
	);
};

export { ConnectedJenkinsServers };
