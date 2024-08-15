# Jenkins for Jira app

[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

Connect your Jenkins servers to Jira Software Cloud for more visibility into your development pipeline.

![Jenkins builds and deployments](docs/jenkins1.png)
**View Jenkins builds and deployments in Jira**zfd;zkshjfksjlzhflkjfhadsk;j.fhaksljfh

Automatically send build and deployment data from Jenkins to Jira Software Cloud so you can see how work is progressing and confirm when features have been shipped.

![Jenkins track work](docs/jenkins2.png)
**Track work as it moves through your pipeline**

View all your Jenkins deployments on a timeline using the deployments feature in Jira. Filter or search to view deployments by environment, assignee, issue type, and more.

![Jenkins secure connect](docs/jenkins3.png)
**Securely connect your self-hosted Jenkins server**

Connect your Jenkins server to Jira Software Cloud using a webhook so it can securely send data without the need to open any firewall ports.

## Usage

The app supports all the features of the Atlassian Jenkins plugin. You can read about them [here](https://github.com/jenkinsci/atlassian-jira-software-cloud-plugin).

The main use case is to show information about Jenkins [builds and deployments in Jira](https://www.atlassian.com/solutions/devops/features).

## Documentation

This is an app that you can install on your Jira site and connect with a Jenkins server. It's built on top of Atlassian's [Forge platform](https://developer.atlassian.com/platform/forge/).

After you install the app, it will guide you through the process of setting everything up.

### Architecture 

On a high level, the app receives events from the Jenkins plugin, updates internal state, and then forwards them to Jira. The app provides a convenient admin UI to manage the connections to one or more Jenkins servers.

![Jenkins app architecture](docs/architecture.png)

The app provides a [web trigger](https://developer.atlassian.com/platform/forge/manifest-reference/modules/web-trigger/) that acts as the entry point to all requests from the Jenkins plugin.

The web trigger and the Jenkins plugin share a secret. This secret is used by the Jenkins plugin to sign the payload, and by the web trigger to verify the signature - so only requests from valid sources are accepted.

On each event, the web trigger updates the internal storage to store information about the latest events. It then sends the events to Jira.

The `app/jenkins-for-jira-ui/src` directory contains the UI components and the `app/src` directory contains the backend functions. See [this README](app/README.md) for more information about working with the Forge app.

## Contributions

Contributions to Jenkins for Jira are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details. 

If you have feedback regarding this app, feel free to raise issues in this repository. 

## License

Copyright (c) 2022 Atlassian and others.
Apache 2.0 licensed, see [LICENSE](LICENSE) file.

<br/> 


[![With â¤ï¸ from Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-cheers.png)](https://www.atlassian.com)
