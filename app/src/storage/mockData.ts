import { JenkinsServer, EventType } from '../common/types';
import { SERVER_STORAGE_KEY_PREFIX } from './constants';

export const currentTime = new Date();
export const timeOneMinuteAgo = new Date(Date.now() - 1000 * 60);
export const oldestPipelineData = new Date(Date.now() - 10000 * 60);
export const buildEvent: EventType = EventType.BUILD;
const deploymentEvent: EventType = EventType.DEPLOYMENT;

export const testUuid = 'test-uuid';

export const mockSingleJenkinsPipeline: JenkinsServer = {
	uuid: testUuid,
	name: 'my server',
	secret: `${SERVER_STORAGE_KEY_PREFIX}${testUuid}`,
	pipelines: [
		{
			name: 'pipeline-1',
			lastEventDate: timeOneMinuteAgo,
			lastEventStatus: 'pending',
			lastEventType: buildEvent
		}
	]
};

export const mockMaxNumberJenkinsPipelines: JenkinsServer = {
	uuid: testUuid,
	name: 'my server',
	secret: `${SERVER_STORAGE_KEY_PREFIX}${testUuid}`,
	pipelines: [
		{
			name: 'pipeline-1',
			lastEventDate: timeOneMinuteAgo,
			lastEventStatus: 'pending',
			lastEventType: buildEvent
		},
		{
			name: 'pipeline-2',
			lastEventDate: timeOneMinuteAgo,
			lastEventStatus: 'in_progress',
			lastEventType: buildEvent
		},
		{
			name: 'pipeline-3',
			lastEventDate: timeOneMinuteAgo,
			lastEventStatus: 'successful',
			lastEventType: deploymentEvent
		},
		{
			name: 'pipeline-4',
			lastEventDate: timeOneMinuteAgo,
			lastEventStatus: 'cancelled',
			lastEventType: buildEvent
		},
		{
			name: 'pipeline-5',
			lastEventDate: oldestPipelineData,
			lastEventStatus: 'in_progress',
			lastEventType: buildEvent
		},
		{
			name: 'pipeline-6',
			lastEventDate: timeOneMinuteAgo,
			lastEventStatus: 'unknown',
			lastEventType: buildEvent
		},
		{
			name: 'pipeline-7',
			lastEventDate: timeOneMinuteAgo,
			lastEventStatus: 'pending',
			lastEventType: buildEvent
		},
		{
			name: 'pipeline-8',
			lastEventDate: timeOneMinuteAgo,
			lastEventStatus: 'rolled_back',
			lastEventType: deploymentEvent
		},
		{
			name: 'pipeline-9',
			lastEventDate: timeOneMinuteAgo,
			lastEventStatus: 'failed',
			lastEventType: deploymentEvent
		},
		{
			name: 'pipeline-10',
			lastEventDate: timeOneMinuteAgo,
			lastEventStatus: 'in_progress',
			lastEventType: deploymentEvent
		}
	]
};
