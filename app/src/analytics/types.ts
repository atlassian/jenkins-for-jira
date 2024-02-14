// All variables below were defined by DataPortal.
// Do not change their values as it will affect our metrics logs and dashboards.
export enum AnalyticsEventTypes {
    ScreenEvent = 'screen', // user navigates to a particular screen, tab, drawer, modal, or inline-dialog
    UiEvent = 'ui', // user interacts with a user interface element such as a button, text field, or link
    TrackEvent = 'track', // user completes a product action e.g. submits form
    OperationalEvent = 'operational' // help measure usages or performance of implementation detail
}
