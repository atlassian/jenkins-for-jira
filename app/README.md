# Jenkins For Jira UI

## Getting Started

### Common Forge commands
There are several Forge CLI commands that need to be run when working with Forge:

- Use the `forge install` command to install the app on a new site.
- Use the `forge tunnel` command to open a HTTP tunnel to your locally running app. It propogates the local version of the app to Jira while the command is running.
- Use the `forge deploy` command to apply and push your changes to the Atlassian cloud. All Jira sites with the Jenkins for Jira app installed will use these deployed changes in the development environment.
- Use the `forge uninstall` command to uninstall the app from your Jira site.
- Use the `forge register` command to generate an app id that you will need to be able to deploy, install and run the app locally.

For more information on running and deploying Forge apps, see [here](https://developer.atlassian.com/platform/forge/build-a-hello-world-app-in-jira/#deploy-app-changes).

### Setting up Forge

> NOTE: This section is only relevant if you've never run Forge commands on your machine.

1. Install the Forge CLI globally by running:
```
npm install -g @forge/cli
```

    If it's been installed correctly, `forge --version` will return the version number.

2. Log in to Forge:
```
forge login
```

    If you've logged in correctly, the CLI will return `Logged in as <your name>`.

For more information, see the [Forge getting started page](https://developer.atlassian.com/platform/forge/getting-started/).

### Setting up the Jenkins for Jira app

The app consists of two components:

* the UI in the folder `app/jenkins-for-jira-ui`.
* the app itself in the folder `app`.

To get up and running, follow the steps below.

#### Initial setup

1. Create your `.env` file and add `BROWSER=none`. This will prevent a tab opening at http:localhost:3000 when you run `yarn start`.
2. Switch to the correct `node` version. You can run `nvm use` in the folders: **/app/jenkins-for-jira-ui** and **/app**.
3. In the folders **/app** and **/app/jenkins-for-jira-ui**, run `yarn install`.

#### Register your Forge app

A Forge app can have only a single owner. This means you need to register your own "version" of the app for testing purposes.

Register your own version of the Forge app by calling `forge register` in the **/app** directory. When prompted to add an app name, use any name you want to identify your app with (we recommend the name `jenkins-for-jira-<yourname>`. This will register a new Forge app and update your `manifest.yml` file with your personal app ID.

Because the `manifest.yml` contains the app ID (something like `ari:cloud:ecosystem::app/3446ee2c-f453-4e83-952a-9c15807e5de1`) and each developer has their own app ID, we're using a [Git filter](https://bignerdranch.com/blog/git-smudge-and-clean-filters-making-changes-so-you-dont-have-to/) so we don't accidentally commit a changed app ID.

Add the following content to your `.git/config` file:

```
[filter "setid"]
  clean = sed "s/<YOUR_APP_UUID>/df76f661-4cbe-4768-a119-13992dc4ce2d/g"
  smudge = sed "s/df76f661-4cbe-4768-a119-13992dc4ce2d/<YOUR_APP_UUID>/g"
```

Replace `<YOUR_APP_UUID>` with the UUID part of your APP ID that you can find in your `manifest.yml`. The UUID `df76f661-4cbe-4768-a119-13992dc4ce2d` is the ID of our "production" app.

The filter `setid` is used in `/app/.gitattributes` so that it replaces your app ID with the ID of our "production" app every time you commit (and the other way around every time you pull). This means you can't accidentally commit your own app ID.

#### Install the app to your Jira instance

1. Build your app by running `yarn build` in **/app/jenkins-for-jira-ui**.
2. Deploy your app by running `forge deploy` in **/app**.
3. Install your app to your Jira site by running `forge install` in **/app**.

Follow the instructions in this setup wizard. Enter the hostname for your Jira site (e.g. `<your-site-name>.atlassian.net`).

> NOTE: This is the *only* step that needs to be repeated to install on different Jira sites. Do not repeat the steps above `forge deploy`. To run your app, follow the steps below.

## Running the app
To run the app, make sure you have installed the app on your site as described above.

### Run the app locally

To start the app locally, run `yarn start` in **/app/jenkins-for-jira-ui**.

The command line will suggest navigating to `localhost:3000` but this does not work for `Custom UI` Forge apps. For more information, see [here](https://community.developer.atlassian.com/t/forge-tunneling-customui-with-ui-resolver-error-cannot-read-property-callbridge-of-undefined/47010/3).

To see your local app in the Jira instance you installed the app into, run `forge tunnel` in the **/app** folder.

All your changes are instantly propagated to your Jira site and you can see them without the need to rebuild or redeploy your app.

To find your app, go to the `Manage apps` page (`https://<your-site-name>.atlassian.net/plugins/servlet/upm`) then select `Jenkins for Jira` in the left-hand panel.

### Deploy changes to the app

To push your latest local changes to the Atlassian cloud, run the following commands:

1. In **/app/jenkins-for-jira-ui** run `yarn build`.
2. In **/app**, run `forge deploy`.

Your local changes will be propagated to **all Jira sites that have the app installed** (unless one runs `forge tunnel`, as that will take priority).


## Tests

In the **/app/jenkins-for-jira-ui** dir, run `yarn test`.
