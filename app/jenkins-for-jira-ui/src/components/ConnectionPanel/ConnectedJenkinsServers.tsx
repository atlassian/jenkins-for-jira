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
	connectedStateCellContainer,
	connectedStateCellEvent,
	connectedStateContainer
} from './ConnectionPanel.styles';

export const timeFromNow = (date: moment.MomentInput): string => {
	const seconds = moment().diff(moment(date), 'seconds');
	const minutes = moment().diff(moment(date), 'minutes');
	const hours = moment().diff(moment(date), 'hours');

	if (hours > 0) {
		return `About ${hours} hour${hours > 1 ? 's' : ''} ago`;
	}
	if (minutes > 0) {
		return `About ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
	}
	return `About ${seconds} second${seconds > 1 ? 's' : ''} ago`;
};

type ConnectedStateProps = {
	connectedJenkinsServer: JenkinsServer
};

type TableHead = {
	cells: {
		key: string;
		content: string;
	}[];
};

interface Row {
	cells: {
		key: string;
		content: React.ReactNode;
	}[];
}

const ConnectedJenkinsServers = ({ connectedJenkinsServer }: ConnectedStateProps): JSX.Element => {
	const tableHead = ():TableHead => {
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

	const rows = (serverName: string, serverId: string, pipelines: JenkinsPipeline[] = []): Row[] => {
		return (
			pipelines.map((pipeline: JenkinsPipeline) => ({
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
									{
										moment().diff(moment(new Date(pipeline.lastEventDate)), 'hours') < 24
											? timeFromNow(new Date(pipeline.lastEventDate))
											: moment(new Date(pipeline.lastEventDate)).format('Do MMMM YYYY [at] hh:mma')
									}
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
