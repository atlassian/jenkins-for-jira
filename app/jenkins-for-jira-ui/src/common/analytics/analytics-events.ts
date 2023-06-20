export enum EnvironmentEnum {
	production = 'production',
	development = 'development',
	test = 'test',
	e2e = 'e2e'
}

export enum BooleanEnum {
	true = 'true',
	false = 'false'
}

// All variables below were defined by DataPortal. Do not change their values
// as it will affect our metrics logs and dashboards.
export enum AnalyticsEventTypes {
	ScreenEvent = 'screen', // user navigates to a particular screen, tab, drawer, modal, or inline-dialog
	UiEvent = 'ui', // user interacts with a user interface element such as a button, text field, or link
	TrackEvent = 'track', // user completes a product action e.g. submits form
	OperationalEvent = 'operational' // help measure usages or performance of implementation detail
}

// All variables below were defined by DataPortal. Do not change their values as it will
// affect our metrics logs and dashboards.
export enum AnalyticsScreenEventsEnum {}

export enum AnalyticsUiEventsEnum {}

export enum AnalyticsTrackEventsEnum {}

export enum AnalyticsOperationalEventsEnum {}
