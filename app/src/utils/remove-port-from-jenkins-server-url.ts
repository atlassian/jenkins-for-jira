import { PayloadWithBuilds, PayloadWithDeployments } from '../common/types';

export const removePortFromJenkinsServerUrl = (
    payload: PayloadWithBuilds | PayloadWithDeployments
): PayloadWithBuilds | PayloadWithDeployments => {
    const localHostRegex = /:\/\/localhost(:\d+)?/;

    if ('builds' in payload) {
        payload.builds.forEach((build) => {
            if (!localHostRegex.test(build.url)) {
                build.url = build.url.replace(/:\d+/, '');
            }
        });
    } else if ('deployments' in payload) {
        payload.deployments.forEach((deployment) => {
            if (!localHostRegex.test(deployment.url)) {
                deployment.url = deployment.url.replace(/:\d+/, '');
            }
            // Also modify the URL in the pipeline object
            if (deployment.pipeline && !localHostRegex.test(deployment.pipeline.url)) {
                deployment.pipeline.url = deployment.pipeline.url.replace(/:\d+/, '');
            }
        });
    }

    return payload;
};
