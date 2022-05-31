import { storage } from '@forge/api';
import { NoJenkinsServerError } from 'jenkins-for-jira-common/error';
import { EventType, BuildEventStatus } from 'jenkins-for-jira-common/types';
import { updateJenkinsServerState } from './update-jenkins-server-state';
import {
  testUuid,
  currentTime,
  buildEvent,
  timeOneMinuteAgo,
  mockSingleJenkinsPipeline,
  mockMaxNumberJenkinsPipelines,
} from './mockData';
import { getAllJenkinsServers } from './get-all-jenkins-servers';

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
                results: [{ key: 'key', value: mockSingleJenkinsPipeline }],
              };
            },
          };
        },
      };
    },
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
                results: [{ key: 'key', value: mockMaxNumberJenkinsPipelines }],
              };
            },
          };
        },
      };
    },
  };
});

describe('Update Jenkins Server Suite', () => {
  it('Should update Jenkins server state to Forge Storage', async () => {
    await updateJenkinsServerState('unique-uid', {
      name: 'PipelineA',
      lastEventType: EventType.BUILD,
      lastEventStatus: 'successful',
      lastEventDate: new Date('2022-01-25T23:27:25.000Z'),
    });
    expect(storage.set).toBeCalled();
  });

  it('Should throw NoJenkinsServerError when invalid uid is passed', async () => {
    expect(async () => {
      await updateJenkinsServerState('error-uid', {
        name: 'PipelineA',
        lastEventType: EventType.BUILD,
        lastEventStatus: 'successful',
        lastEventDate: new Date('2022-01-25T23:27:25.000Z'),
      });
    }).rejects.toThrow(NoJenkinsServerError);
  });

  it('Should throw an error if the server does not exist', async () => {
    try {
      await updateJenkinsServerState(
        mockSingleJenkinsPipeline.uuid,
        mockSingleJenkinsPipeline.pipelines[0],
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
      lastEventType: buildEvent,
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
      lastEventType: buildEvent,
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
      lastEventType: buildEvent,
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
    expect(pipelineExists('pipeline-10')).toBeTruthy();
    expect(pipelineExists('my-new-pipeline')).toBeTruthy();
  });
});
