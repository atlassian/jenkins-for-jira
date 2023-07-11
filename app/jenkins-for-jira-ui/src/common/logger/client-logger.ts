interface AnalyticsEvent {
	eventType: string;
	data?: any;
}

function log(event: AnalyticsEvent) {
	console.log('Analytics Data', event);
}

export { log };
