import { storage } from '@forge/api';
import { NoJenkinsServerError } from '../common/error';
import { EventType, BuildEventStatus } from '../common/types';
import {
	getUniqueEnvironmentNames,
	updateJenkinsPluginConfigState,
	updateJenkinsServerState
} from './update-jenkins-server-state';
import {
	testUuid,
	currentTime,
	buildEvent,
	timeOneMinuteAgo,
	mockSingleJenkinsPipeline,
	mockMaxNumberJenkinsPipelines
} from './mockData';
import { getAllJenkinsServers } from './get-all-jenkins-servers';
import { JenkinsPluginConfigEvent } from '../webtrigger/types';
import { Logger } from '../config/logger';

const givenStorageGetReturnsServerSinglePipeline = jest
	.fn()
	.mockReturnValue(mockSingleJenkinsPipeline);
const givenStorageQueryReturnsServerSinglePipeline = jest.fn().mockImplementation(() => {
	return {
		where: () => {
			return {
				limit: () => {
					return {
						getMany: async () => {
							return {
								results: [{ key: 'key', value: mockSingleJenkinsPipeline }]
							};
						}
					};
				}
			};
		}
	};
});

const givenStorageGetReturnsServerMaxPipelines = jest
	.fn()
	.mockReturnValue(mockMaxNumberJenkinsPipelines);
const givenStorageQueryReturnsServeMaxPipelines = jest.fn().mockImplementation(() => {
	return {
		where: () => {
			return {
				limit: () => {
					return {
						getMany: async () => {
							return {
								results: [{ key: 'key', value: mockMaxNumberJenkinsPipelines }]
							};
						}
					};
				}
			};
		}
	};
});

jest.mock('@forge/api', () => {
	// const mockResolvedValue = jest.fn();
	// const get = jest.fn(() => ({ mockResolvedValue }));
	return {
		__getRuntime: jest.fn(),
		storage: {
			set: jest.fn(),
			get: jest.fn(),
			query: jest.fn()
		},
		startsWith: jest.fn()
	};
});

jest.mock('@forge/metrics', () => {
	const incr = jest.fn();
	const counter = jest.fn(() => ({ incr }));

	return {
		__esModule: true,
		default: {
			internalMetrics: {
				counter
			}
		},
		internalMetrics: {
			counter
		}
	};
});

describe('Update Jenkins Plugin Config State Suite', () => {
	const mockLogger = {
		error: jest.fn()
	} as unknown as Logger;

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('Should update Jenkins plugin config state to Forge Storage', async () => {
		const mockResolvedValue = jest.fn();
		mockResolvedValue.mockResolvedValue({
			key: 'unique-uid',
			pipelines: []
		});

		storage.get = mockResolvedValue;

		const jenkinsEvent = {
			ipAddress: '192.168.0.1',
			autoBuildEnabled: true,
			autoBuildRegex: '^feature/.*$',
			autoDeploymentsEnabled: false,
			autoDeploymentsRegex: ''
		} as unknown as JenkinsPluginConfigEvent;

		await updateJenkinsPluginConfigState('unique-uid', jenkinsEvent, 'cloudId', mockLogger);

		expect(storage.set).toBeCalledWith(
			`jenkinsServer-unique-uid`,
			expect.objectContaining({
				pluginConfig: {
					ipAddress: '192.168.0.1',
					autoBuildEnabled: true,
					autoBuildRegex: '^feature/.*$',
					autoDeploymentsEnabled: false,
					autoDeploymentsRegex: '',
					lastUpdatedOn: expect.any(Date)
				}
			})
		);
	});

	it('Should throw an error if updating Jenkins plugin config fails', async () => {
		const mockResolvedValue = jest.fn();
		mockResolvedValue.mockResolvedValue(undefined);
		storage.get = mockResolvedValue;

		const jenkinsEvent = {
			ipAddress: '192.168.0.1'
		} as unknown as JenkinsPluginConfigEvent;

		await expect(
			updateJenkinsPluginConfigState('error-uuid', jenkinsEvent, 'cloudId', mockLogger)
		).rejects.toThrowError();

		expect(mockLogger.error).toBeCalledWith(
			'Failed to update Jenkins plugin config for server uuid error-uuid',
			{ error: expect.any(Error) }
		);
	});
});

describe('Update Jenkins Server Suite', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('Should update Jenkins server state to Forge Storage', async () => {
		const mockResolvedValue = jest.fn();
		mockResolvedValue.mockResolvedValue({
			key: 'unique-uid',
			pipelines: []
		});

		storage.get = mockResolvedValue;

		await updateJenkinsServerState('unique-uid', {
			name: 'PipelineA',
			lastEventType: EventType.BUILD,
			lastEventStatus: 'successful',
			lastEventDate: new Date('2022-01-25T23:27:25.000Z')
		});
		expect(storage.set).toBeCalled();
	});

	it('Should throw NoJenkinsServerError when invalid uid is passed', async () => {
		const mockResolvedValue = jest.fn();
		mockResolvedValue.mockResolvedValue(undefined);
		storage.get = mockResolvedValue;

		expect(async () => {
			await updateJenkinsServerState('error-uid', {
				name: 'PipelineA',
				lastEventType: EventType.BUILD,
				lastEventStatus: 'successful',
				lastEventDate: new Date('2022-01-25T23:27:25.000Z')
			});
		}).rejects.toThrow(NoJenkinsServerError);
	});

	it('Should throw an error if the server does not exist', async () => {
		const mockResolvedValue = jest.fn();
		mockResolvedValue.mockResolvedValue(undefined);
		storage.get = mockResolvedValue;

		try {
			await updateJenkinsServerState(
				mockSingleJenkinsPipeline.uuid,
				mockSingleJenkinsPipeline.pipelines[0]
			);
		} catch (err) {
			// @ts-ignore
			expect(err.message).toEqual('No Jenkins Server found for UUID test-uuid');
		}
	});

	const eventStatus = 'pending';
	const myEventStatus: BuildEventStatus = eventStatus;

	it('Should add pipeline to array if pipeline does not exist and there are less than 10 pipelines', async () => {
		storage.query = givenStorageQueryReturnsServerSinglePipeline;
		storage.get = givenStorageGetReturnsServerSinglePipeline;

		const savedServers = await getAllJenkinsServers();
		expect(savedServers).toEqual([mockSingleJenkinsPipeline]);
		expect(savedServers[0].pipelines).toHaveLength(1);

		const newPipeline = {
			name: 'my-new-pipeline',
			lastEventDate: currentTime,
			lastEventStatus: myEventStatus,
			lastEventType: buildEvent
		};

		await updateJenkinsServerState(testUuid, newPipeline);

		const updatedServer = await getAllJenkinsServers();

		expect(updatedServer[0].pipelines).toHaveLength(2);
		expect(updatedServer[0].pipelines[0].name).toEqual('my-new-pipeline');
		expect(updatedServer[0].pipelines[1].name).toEqual('pipeline-1');
	});

	it('Should replace pipeline if pipeline already exists', async () => {
		storage.query = givenStorageQueryReturnsServerSinglePipeline;
		storage.get = givenStorageGetReturnsServerSinglePipeline;

		const savedServers = await getAllJenkinsServers();
		expect(savedServers).toEqual([mockSingleJenkinsPipeline]);
		expect(savedServers[0].pipelines).toHaveLength(2);

		const existingPipeline = {
			name: 'pipeline-1',
			lastEventDate: currentTime,
			lastEventStatus: myEventStatus,
			lastEventType: buildEvent
		};

		await updateJenkinsServerState(testUuid, existingPipeline);

		const updatedServer = await getAllJenkinsServers();

		expect(updatedServer[0].pipelines).toHaveLength(2);
		expect(updatedServer[0].pipelines[0].name).toEqual('my-new-pipeline');
		expect(updatedServer[0].pipelines[1].name).toEqual('pipeline-1');
		expect(updatedServer[0].pipelines[0].lastEventDate).toEqual(currentTime);
		expect(updatedServer[0].pipelines[0].lastEventDate).not.toEqual(timeOneMinuteAgo);
	});

	it('Should replace oldest pipeline if pipeline does not exist and there are 10 pipelines', async () => {
		storage.query = givenStorageQueryReturnsServeMaxPipelines;
		storage.get = givenStorageGetReturnsServerMaxPipelines;

		const savedServers = await getAllJenkinsServers();
		expect(savedServers).toEqual([mockMaxNumberJenkinsPipelines]);
		expect(savedServers[0].pipelines).toHaveLength(10);

		const newPipeline = {
			name: 'my-new-pipeline',
			lastEventDate: currentTime,
			lastEventStatus: myEventStatus,
			lastEventType: buildEvent
		};

		await updateJenkinsServerState(testUuid, newPipeline);

		const updatedServer = await getAllJenkinsServers();
		expect(updatedServer[0].pipelines).toHaveLength(10);
		expect(updatedServer[0].pipelines[0].name).toEqual('my-new-pipeline');

		const pipelineExists = (name: string) => {
			return updatedServer[0].pipelines.some((el) => {
				return el.name === name;
			});
		};

		expect(pipelineExists('pipeline-1')).toBeTruthy();
		expect(pipelineExists('pipeline-2')).toBeTruthy();
		expect(pipelineExists('pipeline-3')).toBeTruthy();
		expect(pipelineExists('pipeline-4')).toBeTruthy();
		// Pipeline 5 has the oldest timestamp so should be replaced
		expect(pipelineExists('pipeline-5')).toBeFalsy();
		expect(pipelineExists('pipeline-6')).toBeTruthy();
		expect(pipelineExists('pipeline-7')).toBeTruthy();
		expect(pipelineExists('pipeline-8')).toBeTruthy();
		expect(pipelineExists('pipeline-9')).toBeTruthy();
		expect(pipelineExists('my-new-pipeline')).toBeTruthy();
	});

	it('Should return unique array of environment names', async () => {
		expect(getUniqueEnvironmentNames(['env-1', 'env-2'], ['env-1', 'env-3']))
			.toEqual(['env-1', 'env-2', 'env-3']);
	});

	it('Should return array of environment names if existing is undefined', async () => {
		expect(getUniqueEnvironmentNames(undefined, ['env-1', 'env-3']))
			.toEqual(['env-1', 'env-3']);
	});
});
