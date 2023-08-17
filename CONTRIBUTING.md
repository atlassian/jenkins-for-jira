# Contributing to Jenkins for Jira

Thank you for considering a contribution to Jenkins for Jira! Pull requests, issues and comments are welcome. For pull requests, please:

* Add tests for new features and bug fixes
* Follow the existing style
* Separate unrelated changes into multiple pull requests

See the existing issues for things to start contributing.

For bigger changes, please make sure you start a discussion first by creating an issue and explaining the intended change.

Atlassian requires contributors to sign a Contributor License Agreement, known as a CLA. This serves as a record stating that the contributor is entitled to contribute the code/documentation/translation to the project and is willing to have it used in distributions and derivative works (or is willing to transfer ownership).

Prior to accepting your contributions we ask that you please follow the appropriate link below to digitally sign the CLA. The Corporate CLA is for those who are contributing as a member of an organization and the individual CLA is for those contributing as an individual.

* [CLA for corporate contributors](https://opensource.atlassian.com/corporate)
* [CLA for individuals](https://opensource.atlassian.com/individual)


# Getting Started
For more information on contributing code to this app and setting up your dev environment, see [the README here](app/README.md).

# Environment variables
In app/jenkins-for-jira-ui you'll find 2 example env files:
* .env.example: this contains one variable `SKIP_PREFLIGHT_CHECK`. Add this to a .env file and set it to true if you want to disable the message about the dependency tree's package versions.