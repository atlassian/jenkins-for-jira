import { storage } from '@forge/api';
import { getJenkinsServerSecret } from './get-jenkins-server-secret';
import { SERVER_STORAGE_KEY_PREFIX } from './constants';
import { JenkinsServer } from 'jenkins-for-jira-common/types';
import { NoJenkinsServerError } from 'jenkins-for-jira-common/error';

const getJenkinsServerWithSecret = async (jenkinsServerUuid: string): Promise<JenkinsServer> => {
  try {
    const jenkinsServer: JenkinsServer = await storage.get(`${SERVER_STORAGE_KEY_PREFIX}${jenkinsServerUuid}`);

    if (!jenkinsServer) {
      throw new NoJenkinsServerError(`Couldn't find Jenkins server ${jenkinsServerUuid}`);
    }

    const secret = await getJenkinsServerSecret(jenkinsServerUuid);

    return {
      ...jenkinsServer,
      secret,
    };
  } catch (error) {
    console.error(`Failed to fetch Jenkins server for uuid ${jenkinsServerUuid} `, error);
    throw error;
  }
};

export {
  getJenkinsServerWithSecret,
};
