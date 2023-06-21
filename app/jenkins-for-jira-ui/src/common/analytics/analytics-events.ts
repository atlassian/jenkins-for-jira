// All variables below were defined by DataPortal. Do not change their values
// as it will affect our metrics logs and dashboards.
export enum AnalyticsEventTypes {
	ScreenEvent = 'screen', // user navigates to a particular screen, tab, drawer, modal, or inline-dialog
	UiEvent = 'ui', // user interacts with a user interface element such as a button, text field, or link
	TrackEvent = 'track', // user completes a product action e.g. submits form
	OperationalEvent = 'operational' // help measure usages or performance of implementation detail
}

export enum AnalyticsScreenEventsEnum {
	ConfigurationEmptyStateScreenName = 'configurationEmptyStateScreen',
	ConfigurationConfiguredStateScreenName = 'configurationConfiguredStateScreen',
	InstallJenkinsScreenName = 'installJenkinsScreen',
	CreateJenkinsServerScreenName = 'createJenkinsServerScreen',
	ConnectJenkinsServerScreenName = 'connectJenkinsServerScreen',
	ManageJenkinsConnectionScreenName = 'manageJenkinsConnectionScreen'
}

export enum AnalyticsUiEventsEnum {
	ConnectJenkinsServerEmptyStateName = 'connectJenkinsServerEmptyState',
	ConnectJenkinsServerConfiguredStateName = 'connectJenkinsServerConfiguredState',
	LearnMoreEmptyStateName = 'learnMoreEmptyState',
	NextInstallJenkinsName = 'nextInstallJenkins',
	RefreshSecretConnectJenkinsServerName = 'refreshSecretConnectJenkinsServer',
	RefreshSecretCancelConnectJenkinsServerName = 'refreshSecretCancelConnectJenkinsServer',
	RefreshSecretConfirmConnectJenkinsServerName = 'refreshSecretConfirmConnectJenkinsServer',
	ManageConnectionConfiguredStateName = 'manageConnectionConfiguredState',
	NavigateBackManageJenkinsConnectionName = 'navigateBackManageJenkinsConnections',
	PendingDeploymentConfiguredStateName = 'pendingDeploymentConfiguredStateName',
	DisconnectServerConfiguredStateName = 'disconnectServerConfiguredState',
	DisconnectServerModalClosedConfiguredStateName = 'disconnectServerModalClosedConfiguredState',
	DisconnectServerConfirmConfiguredStateName = 'disconnectServerConfirmConfiguredState'
}

export enum AnalyticsTrackEventsEnum {}

export enum AnalyticsOperationalEventsEnum {}
