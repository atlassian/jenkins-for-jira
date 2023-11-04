import resolver from './resolvers';
import { runGetStartedPage } from './storage/run-as-get-started';
import handleJenkinsRequest from './webtrigger/handle-jenkins-request';
import { handleResetJenkinsRequest } from './webtrigger/handle-reset-jenkins-request';
// import { WebtriggerRequest } from './webtrigger/types';

// const runGetStartedPage = (
//     request: WebtriggerRequest
// ) => {
//     const { siteUrl, environmentId } = request.context;
//     const appId = 'df76f661-4cbe-4768-a119-13992dc4ce2d';
//     return { siteUrl, appId, environmentId };
// };

// webtriggers
export { handleJenkinsRequest, handleResetJenkinsRequest };

// resolvers
export { resolver, runGetStartedPage };
