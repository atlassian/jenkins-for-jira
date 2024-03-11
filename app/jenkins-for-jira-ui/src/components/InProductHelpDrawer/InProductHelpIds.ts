export enum InProductHelpIds {
	CONNECTION_WIZARD_DISCUSS_WITH_TEAM = '7wpTJHMn4YCOTpfsOVJaNK',
	JENKINS_SET_UP_NON_ADMIN_HOW_TO = '1sRSLxu8cY2EgClV1fdECt',
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
		case 'set up a jenkinsfile to explicitly send deployment events to jira':
			return InProductHelpIds.SET_UP_GUIDE_JIRA_SEND_DEPLOYMENT_INFO;
		case 'set up a jenkinsfile to explicitly send build events to jira':
			return InProductHelpIds.SET_UP_GUIDE_JIRA_SEND_BUILD_INFO;
		case 'discuss your connection with your team' || 'here’s how to find out.':
			return InProductHelpIds.CONNECTION_WIZARD_DISCUSS_WITH_TEAM;
		case 'set up guide' || 'set up guides' || 'or share that guide with your project teams':
			return InProductHelpIds.SET_UP_GUIDE_WHAT_YOU_NEED_TO_KNOW;
		case 'update the server’s atlassian software cloud plugin':
			return InProductHelpIds.UPDATE_AVAILABLE_SERVER_LEARN_MORE;
		case 'pending':
			return InProductHelpIds.PENDING_SERVER_LEARN_MORE;
		default:
			return '';
	}
};
