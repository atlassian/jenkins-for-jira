export function extractCloudId(installContext: string): string {
  return installContext.replace('ari:cloud:jira::site/', '');
}

export function getQueryParameterValue(name: string, queryParameters: any): string | null {
  if (queryParameters[name] && queryParameters[name].length > 0) {
    return queryParameters[name][0];
  }
  return null;
}
