import { PayloadWithBuilds, PayloadWithDeployments } from '../common/types';

export const removePortFromJenkinsServerUrl = (payload: PayloadWithBuilds | PayloadWithDeployments): void => {
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
        });
    }
};
