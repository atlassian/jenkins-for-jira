// All variables below were defined by DataPortal. Do not change their values
// as it will affect our metrics logs and dashboards.
export enum AnalyticsEventTypes {
	ScreenEvent = 'screen', // user navigates to a particular screen, tab, drawer, modal, or inline-dialog
	UiEvent = 'ui', // user interacts with a user interface element such as a button, text field, or link
	TrackEvent = 'track', // user completes a product action e.g. submits form
	OperationalEvent = 'operational' // help measure usages or performance of implementation detail
}

<<<<<<< HEAD
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
	ConnectJenkinsServerRefreshName = 'connectJenkinsServerRefresh',
	ConnectJenkinsServerRefreshSecretCancelName = 'connectJenkinsServerRefreshSecretCancel',
	ConnectJenkinsServerRefreshSecretConfirmName = 'connectJenkinsServerRefreshSecretConfirm',
	ConfigurationManageConnectionName = 'configurationManageConnnection',
	ManageConnectionNavigateBackName = 'manageConnectionNavigateBack',
	ConfigurationPendingDeploymentName = 'pendingDeploymentName',
	ConfigurationDisconnectServerName = 'disconnectServer',
	ConfigurationDisconnectServerModalClosedName = 'disconnectServerModalClosed',
	ConfigurationDisconnectServerConfirmName = 'disconnectServerConfirm'
}

export enum AnalyticsTrackEventsEnum {
	CreatedJenkinsServerSuccessName = 'createdJenkinsServerSuccess',
	CreatedJenkinsServerErrorName = 'createdJenkinsServerError',
	ConnectedJenkinsServerSuccessName = 'connectedJenkinsServerSuccess',
	ConnectedJenkinsServerErrorName = 'connectedJenkinsServerError',
	UpdateServerSuccessName = 'updateServerSuccessName',
	UpdateServerErrorName = 'updateServerErrorName'
}

export enum AnalyticsOperationalEventsEnum {
	GetServerManageConnectionSuccessName = 'getServerManageConnectionSuccess',
	GetServerManageConnectionErrorName = 'getServerManageConnectionError',
	DisconnectServerManageConnectionSuccessName = 'disconnectedServerManageConnectionSuccess',
	DisconnectServerManageConnectionErrorName = 'disconnectServerManageConnectionError'
}
=======
export enum AnalyticsScreenEventsEnum {}

export enum AnalyticsUiEventsEnum {}

export enum AnalyticsTrackEventsEnum {}

export enum AnalyticsOperationalEventsEnum {}
>>>>>>> master
