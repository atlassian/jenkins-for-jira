# Jenkins for Jira app

This is an app that you can install into your Jira site to connect it with a Jenkins server. It's built on top of Atlassian's [Forge platform](https://developer.atlassian.com/platform/forge/).

After installing the app, the app will guide you through the process of setting everything up.

This app is owned and operated by Atlassian. 

## Features

The app supports all the features of the Atlassian Jenkins plugin. You can read about them [here](https://github.com/jenkinsci/atlassian-jira-software-cloud-plugin).

The main use case is to show information about Jenkins [builds and deployments in Jira](https://www.atlassian.com/solutions/devops/features).

## Architecture 

On a high level, the app receives events from the Jenkins plugin, updates internal state, and then forwards them to Jira. The app provides a convenient admin UI to manage the connections to one or more Jenkins servers.

![Jenkins app architecture](docs/architecture.png)

The app provides a [web trigger](https://developer.atlassian.com/platform/forge/manifest-reference/modules/web-trigger/) that acts as the entry point to all requests from the Jenkins plugin.

The web trigger and the Jenkins plugin share a secret that is used by the Jenkins plugin to sign the payload and by the web trigger to verify the signature so that only requests from valid sources are accepted.

On each event, the web trigger updates the internal storage to store information about the latest events and then sends the events to Jira.

The `app/jenkins-for-jira-ui/src` directory contains the UI components and the `app/src` directory contains the backend functions. See [this README](app/README.md) for more information about working with the Forge app.

## Feedback

If you have feedback regarding this app, feel free to raise issues in this repository. 
