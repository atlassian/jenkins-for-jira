import { disconnectJenkinsServer } from './disconnect-jenkins-server';

describe('Delete Jenkins Server Suite', () => {
  it('Should delete Jenkins server configuration from Forge Storage', async () => {
    const result = await disconnectJenkinsServer('test-uid');
    expect(result).toBe(true);
  });
});
