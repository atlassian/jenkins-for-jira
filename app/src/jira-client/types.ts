/**
 * A response from the Jira API.
 */
export interface JiraResponse {
  status: number,

  // TODO: create body types for all success and error scenarios
  body: object
}
