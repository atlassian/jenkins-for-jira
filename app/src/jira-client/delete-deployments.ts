import { JiraResponse } from './types';

async function deleteDeployments(cloudId: string, jenkinsServerUuid?: string): Promise<JiraResponse> {
  let url = `/jira/deployments/0.1/cloud/${cloudId}/bulkByProperties?cloudId=${cloudId}`;
  if (jenkinsServerUuid) {
    url += `&jenkinsServerUuid=${jenkinsServerUuid}`;
  }
  // @ts-ignore // required so that Typescript doesn't complain about the missing "api" property
  // eslint-disable-next-line no-underscore-dangle
  const apiResponse = await global.api
    .asApp()
    .__requestAtlassian(url, {
      method: 'DELETE',
    });

  return {
    status: apiResponse.status,
    body: { },
  };
}

export { deleteDeployments };
