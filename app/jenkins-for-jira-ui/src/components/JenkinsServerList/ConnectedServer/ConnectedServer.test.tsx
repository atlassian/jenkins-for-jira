import RecentIcon from '@atlaskit/icon/glyph/recent';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import {
	mapLastEventStatus,
	mapLastEventStatusIcons
} from './ConnectedServers';
import { mockMaxNumberJenkinsPipelines } from '../../../../../src/storage/mockData';
import { EventType, JenkinsPipeline } from '../../../../../src/common/types';
import { InProgressIcon } from '../../icons/InProgressIcon';
import { FailedIcon } from '../../icons/FailedIcon';
import { RolledBackIcon } from '../../icons/RolledBackIcon';
import { CancelledIcon } from '../../icons/CancelledIcon';

describe('ConnectedServers Suite', () => {
	describe('ConnectedServers helper functions', () => {
		it('mapLastEventStatus should correctly map lastEventStatus', () => {
			mockMaxNumberJenkinsPipelines.pipelines.forEach((pipeline) => {
				if (pipeline.lastEventStatus === 'in_progress') {
					expect(mapLastEventStatus(pipeline.lastEventStatus)).toEqual('in-progress');
				}

				if (pipeline.lastEventStatus === 'cancelled') {
					expect(mapLastEventStatus(pipeline.lastEventStatus)).toEqual('canceled');
				}

				if (pipeline.lastEventStatus === 'rolled_back') {
					expect(mapLastEventStatus(pipeline.lastEventStatus)).toEqual('rolled back');
				}
			});
		});

		describe('mapLastEventStatusIcons', () => {
			const buildEvent: EventType = EventType.BUILD;
			const deploymentEvent: EventType = EventType.DEPLOYMENT;

			it('mapLastEventStatusIcons should correctly map icons for in-progress events', () => {
				const inProgressPipeline: JenkinsPipeline = {
					name: 'my-pipeline',
					lastEventDate: new Date(),
					lastEventStatus: 'in_progress',
					lastEventType: buildEvent
				};

				expect(mapLastEventStatusIcons(inProgressPipeline.lastEventStatus)).toEqual(
					<InProgressIcon />
				);
			});

			it('mapLastEventStatusIcons should correctly map icons for failed events', () => {
				const failedPipeline: JenkinsPipeline = {
					name: 'my-pipeline',
					lastEventDate: new Date(),
					lastEventStatus: 'failed',
					lastEventType: buildEvent
				};

				expect(mapLastEventStatusIcons(failedPipeline.lastEventStatus)).toEqual(<FailedIcon />);
			});

			it('mapLastEventStatusIcons should correctly map icons for rolled back events', () => {
				const rolledBackPipeline: JenkinsPipeline = {
					name: 'my-pipeline',
					lastEventDate: new Date(),
					lastEventStatus: 'rolled_back',
					lastEventType: deploymentEvent
				};

				expect(mapLastEventStatusIcons(rolledBackPipeline.lastEventStatus)).toEqual(
					<RolledBackIcon />
				);
			});

			it('mapLastEventStatusIcons should correctly map icons for pending events', () => {
				const pendingPipeline: JenkinsPipeline = {
					name: 'my-pipeline',
					lastEventDate: new Date(),
					lastEventStatus: 'pending',
					lastEventType: buildEvent
				};

				expect(mapLastEventStatusIcons(pendingPipeline.lastEventStatus)).toEqual(
					<RecentIcon
						label="Event pending"
						primaryColor="#0065FF"
						size="medium"
					/>
				);
			});

			it('mapLastEventStatusIcons should correctly map icons for cancelled events', () => {
				const cancelledPipeline: JenkinsPipeline = {
					name: 'my-pipeline',
					lastEventDate: new Date(),
					lastEventStatus: 'cancelled',
					lastEventType: buildEvent
				};

				expect(mapLastEventStatusIcons(cancelledPipeline.lastEventStatus)).toEqual(
					<CancelledIcon />
				);
			});

			it('mapLastEventStatusIcons should correctly map icons for unknown events', () => {
				const unknownPipeline: JenkinsPipeline = {
					name: 'my-pipeline',
					lastEventDate: new Date(),
					lastEventStatus: 'unknown',
					lastEventType: buildEvent
				};

				expect(mapLastEventStatusIcons(unknownPipeline.lastEventStatus)).toEqual(
					<QuestionCircleIcon
						label="Event unknown"
						primaryColor="#6B778C"
						size="medium"
					/>
				);
			});

			it('mapLastEventStatusIcons should correctly map icons for successful events', () => {
				const successfulPipeline: JenkinsPipeline = {
					name: 'my-pipeline',
					lastEventDate: new Date(),
					lastEventStatus: 'successful',
					lastEventType: deploymentEvent
				};

				expect(mapLastEventStatusIcons(successfulPipeline.lastEventStatus)).toEqual(
					<CheckCircleIcon
						label="Event successful"
						primaryColor="#36B27E"
						size="medium"
					/>
				);
			});
		});
	});
});
