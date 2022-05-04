import {
  ListResult, QueryBuilder, Result,
} from '@forge/api';
import { JenkinsServer } from '../common/types';
import { getAllJenkinsServers } from './get-all-jenkins-servers';

jest.mock('@forge/api', () => ({
  storage: {
    get: jest.fn(),
    set: jest.fn(),
    setSecret: jest.fn(),
    getSecret: jest.fn(),
    delete: jest.fn(),
    deleteSecret: jest.fn(),
    query: jest.fn(() => new MockQueryBuilder()),
  },
  webTrigger: {
    getUrl: jest.fn(),
  },
  startsWith: jest.fn(),
}));

class MockQueryBuilder implements QueryBuilder {
  limit(): QueryBuilder {
    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  getMany(): Promise<ListResult> {
    return Promise.resolve(mockListResult);
  }

  // eslint-disable-next-line class-methods-use-this
  getOne(): Promise<Result | undefined> {
    throw new Error('Method not implemented.');
  }

  where(): QueryBuilder {
    return this;
  }

  cursor(): QueryBuilder {
    return this;
  }
}

const mockPipeline1 = {
  name: 'Data Depot Deployment', lastEventType: 'deployment', lastEventStatus: 'passed', lastEventDate: '2018-10-25T23:27:25.000Z',
};

const mockPipeline2 = {
  name: 'New Build Plan', lastEventType: 'build', lastEventStatus: 'failed', lastEventDate: '2022-02-21T23:27:25.000Z',
};
const mockJenkinsServer = {
  name: 'flabby-yogi',
  uuid: 'f15ae92a-c6c5-4bc0-bc66-ceea10b6cb22',
  pipelines: [mockPipeline1, mockPipeline2],
};

const mockListResult: ListResult = {
  results: [
    {
      key: 'jenkinsServer-f15ae92a-c6c5-4bc0-bc66-ceea10b6cb22',
      value: mockJenkinsServer,
    },
  ],
};

describe('Get All Jenkins Servers Suite', () => {
  it('Should return all Jenkins servers sorted by last event timestamp', async () => {
    const allJenkinsServers: JenkinsServer[] = await getAllJenkinsServers();

    expect(allJenkinsServers.length).toBe(mockListResult.results.length);

    expect(allJenkinsServers[0].pipelines.length).toBe(mockJenkinsServer.pipelines.length);

    expect(allJenkinsServers[0]).toEqual(
      expect.objectContaining({
        name: mockJenkinsServer.name,
        uuid: mockJenkinsServer.uuid,
      }),
    );

    expect(allJenkinsServers[0].pipelines[0]).toEqual(
      expect.objectContaining({
        name: mockPipeline2.name,
        lastEventType: mockPipeline2.lastEventType,
        lastEventStatus: mockPipeline2.lastEventStatus,
        lastEventDate: mockPipeline2.lastEventDate,
      }),
    );

    expect(allJenkinsServers[0].pipelines[1]).toEqual(
      expect.objectContaining({
        name: mockPipeline1.name,
        lastEventType: mockPipeline1.lastEventType,
        lastEventStatus: mockPipeline1.lastEventStatus,
        lastEventDate: mockPipeline1.lastEventDate,
      }),
    );
  });
});
