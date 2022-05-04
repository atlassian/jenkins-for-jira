import { BuildEventStatus, DeploymentEventStatus, EventType } from '../common/types';

export enum RequestType {
  EVENT = 'event',
  GATING_STATUS = 'gatingStatus',
  PING = 'ping',
  RESET_JENKINS_SERVER = 'resetJenkinsServer',
}

export interface WebtriggerRequest {
  queryParameters: object;
  body: string;
}

export interface WebtriggerResponse {
  body: string;
  statusCode: number;
  headers: { 'Content-Type': string[] };
}

export interface ForgeTriggerContext {
  installContext: string;
}

export interface JenkinsRequest {
  requestType: RequestType
}

export interface JenkinsEvent extends JenkinsRequest {
  eventType: EventType,
  pipelineName?: string;
  status?: BuildEventStatus | DeploymentEventStatus,
  lastUpdated?: Date,
  payload: any
}

export interface GatingStatusRequest extends JenkinsRequest {
  deploymentId: string,
  pipelineId: string,
  environmentId: string
}
