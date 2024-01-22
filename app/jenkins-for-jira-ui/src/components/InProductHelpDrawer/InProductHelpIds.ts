export enum InProductHelpIds {
	CONNECTION_WIZARD_DISCUSS_WITH_TEAM = '7wpTJHMn4YCOTpfsOVJaNK',
	JENKINS_SET_UP_NON_ADMIN_HOW_TO = '1sRSLxu8cY2EgClV1fdECt',
	JENKINS_SET_UP_STEP_BY_STEP_GUIDE = '1sRSLxu8cY2EgClV1fdECt',
	PENDING_SERVER_LEARN_MORE = 'nbscI1bo5J1s7YHZAmAfW',
	UPDATE_AVAILABLE_SERVER_LEARN_MORE = '6ahygJXnMtn6Zug4TpriOM',
	SET_UP_GUIDE_NO_SET_UP_REQUIRED = 'QVZVQnF49IUZswvVNEe32',
	SET_UP_GUIDE_JIRA_SEND_BUILD_INFO = '2Ha335HQ9xgSTGOigrUQvt',
	SET_UP_GUIDE_JIRA_SEND_DEPLOYMENT_INFO = '7JuwfeK5UFhGRKWVV2o0dE',
	SET_UP_GUIDE_BUILD_STAGES = '1tGX5Mkw5l0JqLGn2Err79',
	SET_UP_GUIDE_DEPLOYMENT_STAGES = '4EUiNVCtuDGhvKHuomL94F',
	SET_UP_GUIDE_WHAT_YOU_NEED_TO_KNOW = '5FbkJQKBJRN92vTktHCbA0'
}

export const getIdForLinkInIphDrawer = (searchQueryText: string) => {
	switch (searchQueryText) {
		case 'set up a Jenkinsfile to explicitly send deployment events to Jira.':
			return InProductHelpIds.SET_UP_GUIDE_DEPLOYMENT_STAGES;
		case 'Discuss your connection with your team' || 'Here’s how to find out.':
			return InProductHelpIds.CONNECTION_WIZARD_DISCUSS_WITH_TEAM;
		case 'set up guide' || 'Set up guides':
			return InProductHelpIds.SET_UP_GUIDE_WHAT_YOU_NEED_TO_KNOW;
		case 'pending':
			return InProductHelpIds.PENDING_SERVER_LEARN_MORE;
		default:
			return '';
	}
};
