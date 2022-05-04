import { JiraResponse } from './types';

async function getGatingStatusFromJira(
  cloudId: string,
  deploymentId: string,
  pipelineId: string,
  environmentId: string,
): Promise<JiraResponse> {
  // I would have liked to use Forge's `route` template to create the URL
  // (https://developer.atlassian.com/platform/forge/runtime-reference/product-fetch-api/#route),
  // but it fails with the error described here:
  // https://community.developer.atlassian.com/t/problems-with-part-2-call-a-jira-api-in-forge-developer-tutorial/48818.
  // Probably it's not compatible with the `__requestAtlassian()` function?
  // Workaround: call `encodeURIComponent()` on each parameter by hand.
  // eslint-disable-next-line max-len
  const getGatingStatusRoute = `/jira/deployments/0.1/cloud/${encodeURIComponent(cloudId)}/pipelines/${encodeURIComponent(pipelineId)}/environments/${encodeURIComponent(environmentId)}/deployments/${encodeURIComponent(deploymentId)}/gating-status`;

  // @ts-ignore // required so that Typescript doesn't complain about the missing "api" property
  // eslint-disable-next-line no-underscore-dangle
  const apiResponse = await global.api
    .asApp()
    .__requestAtlassian(getGatingStatusRoute, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    });

  const responseString = await apiResponse.text();

  // eslint-disable-next-line no-console,max-len
  console.log(`called Jira API ${getGatingStatusRoute}. Response status: ${apiResponse.status}. Response body: ${responseString}`);

  if (!responseString) {
    return {
      status: apiResponse.status,
      body: { },
    };
  }

  // unwrap the response from the Jira API
  const jiraResponse = JSON.parse(responseString);

  return {
    status: apiResponse.status,
    body: jiraResponse,
  };
}

export { getGatingStatusFromJira };
