interface AnalyticsEvent {
	eventType: string;
	data?: Object;
}

function log(event: AnalyticsEvent) {
	console.log('Analytics Data', event);
}

export { log };
