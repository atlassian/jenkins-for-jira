// All variables below were defined by DataPortal. Do not change their values
// as it will affect our metrics logs and dashboards.
export enum AnalyticsEventTypes {
	ScreenEvent = 'screen', // user navigates to a particular screen, tab, drawer, modal, or inline-dialog
	UiEvent = 'ui', // user interacts with a user interface element such as a button, text field, or link
	TrackEvent = 'track', // user completes a product action e.g. submits form
	OperationalEvent = 'operational' // help measure usages or performance of implementation detail
}

export enum AnalyticsScreenEventsEnum {
	ConfigurationEmptyStateScreenName = 'configurationEmptyStateScreen', // DONE
	ConfigurationConfiguredStateScreenName = 'configurationConfiguredStateScreen', // DONE
	InstallJenkinsScreenName = 'installJenkinsScreen', // DONE
	CreateJenkinsServerScreenName = 'createJenkinsServerScreen', // DONE
	ConnectJenkinsServerScreenName = 'connectJenkinsServerScreen', // DONE
	ManageJenkinsConnectionScreenName = 'manageJenkinsConnectionScreen' // DONE
}

export enum AnalyticsUiEventsEnum {
	ConnectJenkinsServerEmptyStateName = 'connectJenkinsServerEmptyState', // DONE
	ConnectJenkinsServerConfiguredStateName = 'connectJenkinsServerConfiguredState', // DONE
	LearnMoreEmptyStateName = 'learnMoreEmptyState', // DONE
	NextInstallJenkinsName = 'nextInstallJenkins', // DONE
	CreateJenkinsServerName = 'createJenkinsServer',
	RefreshSecretConnectJenkinsServerName = 'refreshSecretConnectJenkinsServer', // DONE
	RefreshSecretCancelConnectJenkinsServerName = 'refreshSecretCancelConnectJenkinsServer', // DONE
	RefreshSecretConfirmConnectJenkinsServerName = 'refreshSecretConfirmConnectJenkinsServer', // DONE,
	RefreshSecretManageJenkinsServerName = 'refreshSecretManageJenkinsServer',
	RefreshSecretCancelManageJenkinsServerName = 'refreshSecretCancelManageJenkinsServer',
	RefreshSecretConfirmManageJenkinsServerName = 'refreshSecretConfirmManageJenkinsServer',
	ConnectJenkinsServerName = 'connectJenkinsServer',
	ManageConnectionConfiguredStateName = 'manageConnectionConfiguredState', // DONE,
	ManageConnectionHelpLinkName = 'manageConnectionHelpLink',
	NavigateBackManageJenkinsConnectionName = 'navigateBackManageJenkinsConnections',
	PendingDeploymentConfiguredStateName = 'pendingDeploymentConfiguredStateName', // DONE,
	DisconnectServerConfiguredStateName = 'disconnectServerConfiguredState', // DONE,
	DisconnectServerModalClosedConfiguredStateName = 'disconnectServerModalClosedConfiguredState', // DONE,
	DisconnectServerConfirmConfiguredStateName = 'disconnectServerConfirmConfiguredState' // DONE,
}

export enum AnalyticsTrackEventsEnum {
	CreatedJenkinsServerSuccessName = 'createdJenkinsServerSuccess', // DONE
	CreatedJenkinsServerErrorName = 'createdJenkinsServerError', // DONE
	ConnectedJenkinsServerSuccessName = 'connectedJenkinsServerSuccess', // DONE,
	ConnectedJenkinsServerErrorName = 'connectedJenkinsServerError', // DONE,
	UpdatedServerSuccessName = 'updatedServerSuccessName', // DONE,
	UpdatedServerErrorName = 'updatedServerErrorName', // DONE,
	GetServerSuccessManageConnectionName = 'getServerSuccessManageConnection', // DONE,
	GetServerErrorManageConnectionName = 'getServerErrorManageConnection', // DONE,
	GetServerSuccessJenkinsConfigurationName = 'getServerSuccessJenkinsConfiguration',
	GetServerErrorJenkinsConfigurationName = 'getServerErrorJenkinsConfiguration',
	DisconnectServerSuccessServerManageConnectionName = 'disconnectedServerSuccessManageConnection', // DONE,
	DisconnectServerErrorManageConnectionName = 'disconnectServerErrorManageConnection', // DONE,
	TotalNumberJenkinsServersName = 'totalNumberJenkinsServers',
	TotalNumberOfServersWithPipelines = 'totalNumberOfServersWithPipelines',
	TotalNumberOfServersWithoutPipelines = 'totalNumberOfServersWithoutPipelines'
}

export enum AnalyticsOperationalEventsEnum {}
