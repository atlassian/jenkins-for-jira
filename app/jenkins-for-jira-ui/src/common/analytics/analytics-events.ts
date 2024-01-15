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
	ManageJenkinsConnectionScreenName = 'manageJenkinsConnectionScreen',
	PendingDeploymentStateScreenName = 'pendingDeploymentStateScreen',
	ConnectionWizardScreenName = 'connectWizardScreen',
	ServerNameScreenName = 'serverNameScreen',
	JenkinsSetupScreenName = 'jenkinsSetupScreen',
	ConnectionCompleteScreenName = 'connectionCompleteScreen'
}

export enum AnalyticsUiEventsEnum {
	ConnectJenkinsServerEmptyStateName = 'connectJenkinsServerEmptyState',
	ConnectJenkinsServerConfiguredStateName = 'connectJenkinsServerConfiguredState',
	LearnMoreEmptyStateName = 'learnMoreEmptyState',
	NextInstallJenkinsName = 'nextInstallJenkins',
	CreateJenkinsServerName = 'createJenkinsServer',
	RefreshSecretConnectJenkinsServerName = 'refreshSecretConnectJenkinsServer',
	RefreshSecretCancelConnectJenkinsServerName = 'refreshSecretCancelConnectJenkinsServer',
	RefreshSecretConfirmConnectJenkinsServerName = 'refreshSecretConfirmConnectJenkinsServer',
	RefreshSecretManageJenkinsServerName = 'refreshSecretManageJenkinsServer',
	RefreshSecretCancelManageJenkinsServerName = 'refreshSecretCancelManageJenkinsServer',
	RefreshSecretConfirmManageJenkinsServerName = 'refreshSecretConfirmManageJenkinsServer',
	ConnectJenkinsServerName = 'connectJenkinsServer',
	ManageConnectionConfiguredStateName = 'manageConnectionConfiguredState',
	ManageConnectionHelpLinkName = 'manageConnectionHelpLink',
	NavigateBackManageJenkinsConnectionName = 'navigateBackManageJenkinsConnections',
	PendingDeploymentConfiguredStateName = 'pendingDeploymentConfiguredStateName',
	DisconnectServerConfiguredStateName = 'disconnectServerConfiguredState',
	DisconnectServerModalClosedConfiguredStateName = 'disconnectServerModalClosedConfiguredState',
	DisconnectServerConfirmConfiguredStateName = 'disconnectServerConfirmConfiguredState',
	ManageConnectionPendingStateName = 'manageConnectionPendingState',
	NavigateBackPendingDeploymentStateName = 'navigateBackPendingDeploymentState',
	OpenInProductionHelpDrawerName = 'openInProductHelpDrawer',
	MyJenkinsAdminTabName = 'myJenkinsAdminTab',
	IAmAJenkinsAdminTabName = 'iAmAJenkinsAdminTab',
	CopiedToClipboardName = 'copiedToClipboard',
	ViewStepByStepGuideName = 'viewStepByStepGuide'
}

export enum AnalyticsTrackEventsEnum {
	CreatedJenkinsServerSuccessName = 'createdJenkinsServerSuccess',
	CreatedJenkinsServerErrorName = 'createdJenkinsServerError',
	ConnectedJenkinsServerSuccessName = 'connectedJenkinsServerSuccess',
	ConnectedJenkinsServerErrorName = 'connectedJenkinsServerError',
	UpdatedServerSuccessName = 'updatedServerSuccessName',
	UpdatedServerErrorName = 'updatedServerErrorName',
	GetServerSuccessManageConnectionName = 'getServerSuccessManageConnection',
	GetServerErrorManageConnectionName = 'getServerErrorManageConnection',
	GetServerSuccessJenkinsConfigurationName = 'getServerSuccessJenkinsConfiguration',
	GetServerErrorJenkinsConfigurationName = 'getServerErrorJenkinsConfiguration',
	DisconnectServerSuccessServerManageConnectionName = 'disconnectedServerSuccessManageConnection',
	DisconnectServerErrorManageConnectionName = 'disconnectServerErrorManageConnection',
	TotalNumberJenkinsServersName = 'totalNumberJenkinsServers',
	TotalNumberOfServersWithPipelines = 'totalNumberOfServersWithPipelines',
	TotalNumberOfServersWithoutPipelines = 'totalNumberOfServersWithoutPipelines',
	GenerateNewSecretErrorConnectJenkinsServerName = 'generateNewSecretErrorConnectJenkinsServer'
}

export enum AnalyticsOperationalEventsEnum {}
