/**
 * This is an integration test of the whole code path from the webtrigger through the app
 * to the Jira API.
 */
import { when } from 'jest-when';
import { storage } from '@forge/api';
import { handleJenkinsRequest } from '../index';
import {
	ForgeTriggerContext, WebtriggerRequest, WebtriggerResponse
} from './types';
import { SECRET_STORAGE_KEY_PREFIX, SERVER_STORAGE_KEY_PREFIX } from '../storage/constants';
import { sendEventToJira } from '../jira-client/send-event-to-jira';
import { JiraResponse } from '../jira-client/types';
import { EventType } from '../common/types';
import { getGatingStatusFromJira } from '../jira-client/get-gating-status-from-jira';

jest.mock('../jira-client/send-event-to-jira');
jest.mock('../jira-client/get-gating-status-from-jira');

const CLOUD_ID = '97eaf652-4b6e-46cf-80c2-d99327a63bc1';
const JENKINS_SERVER_UUID = '1aaf4ea5-bca5-4ec9-86ed-c359e359eb97';

// You can paste the JWT into https://jwt.io to see its contents
const BUILD_EVENT_JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJqZW5raW5zLWZvcmdlLWFwcCIsInJlcXVlc3RfYm9keV9qc29uIjoie1wicmVxdWVzdFR5cGVcIjpcImV2ZW50XCIsXCJldmVudFR5cGVcIjpcImJ1aWxkXCIsXCJwaXBlbGluZU5hbWVcIjpcInBpcGVsaW5lTmFtZVwiLFwic3RhdHVzXCI6XCJzdWNjZXNzZnVsXCIsXCJsYXN0VXBkYXRlZFwiOlwiMjAyMi0wMy0wN1QwNDozOTozMy4xNDE5NjNaXCIsXCJwYXlsb2FkXCI6e1wicHJvcGVydGllc1wiOntcInNvdXJjZVwiOlwiamVua2luc1wifSxcInByb3ZpZGVyTWV0YWRhdGFcIjp7XCJwcm9kdWN0XCI6XCJqZW5raW5zXCJ9LFwiYnVpbGRzXCI6W3tcInBpcGVsaW5lSWRcIjpcInBpcGVsaW5lSWRcIixcImJ1aWxkTnVtYmVyXCI6MTIsXCJ1cGRhdGVTZXF1ZW5jZU51bWJlclwiOjEyLFwiZGlzcGxheU5hbWVcIjpcInBpcGVsaW5lTmFtZVwiLFwiZGVzY3JpcHRpb25cIjpcImRlc2NyaXB0aW9uXCIsXCJsYWJlbFwiOlwibGFiZWxcIixcInVybFwiOlwiaHR0cHM6Ly91cmwuY29tXCIsXCJzdGF0ZVwiOlwic3VjY2Vzc2Z1bFwiLFwibGFzdFVwZGF0ZWRcIjpcIjIwMjItMDMtMDdUMDQ6Mzk6MzMuMTQyMjAxWlwiLFwiaXNzdWVLZXlzXCI6W1wiSkVOLTI1XCJdLFwicmVmZXJlbmNlc1wiOlt7XCJjb21taXRcIjp7XCJpZFwiOlwiY2FmZWJhYmVcIixcInJlcG9zaXRvcnlVcmlcIjpcImh0dHBzOi8vcmVwby51cmxcIn0sXCJyZWZcIjp7XCJuYW1lXCI6XCJyZWZuYW1lXCIsXCJ1cmlcIjpcImh0dHBzOnJlZi51cmlcIn19XSxcInRlc3RJbmZvXCI6e1widG90YWxOdW1iZXJcIjowLFwibnVtYmVyUGFzc2VkXCI6MCxcIm51bWJlckZhaWxlZFwiOjAsXCJudW1iZXJTa2lwcGVkXCI6MH0sXCJzY2hlbWFWZXJzaW9uXCI6XCIxLjBcIn1dfSxcInBpcGVsaW5lSWRcIjpcInBpcGVsaW5lSWRcIn0iLCJpc3MiOiJqZW5raW5zLXBsdWdpbiIsImV4cCI6MzI0NzQ4MzkxNzEsImlhdCI6MTY0NjYyNzk3M30.N5ZcLeoBVLlnZYok0AWqzYkxoS-O3vBilmiOXoobiko';
const BUILD_EVENT_PAYLOAD = {
	properties: { source: 'jenkins' },
	providerMetadata: { product: 'jenkins' },
	builds: [{
		pipelineId: 'pipelineId',
		buildNumber: 12,
		updateSequenceNumber: 12,
		displayName: 'pipelineName',
		description: 'description',
		label: 'label',
		url: 'https://url.com',
		state: 'successful',
		lastUpdated: '2022-03-07T04:39:33.142201Z',
		issueKeys: ['JEN-25'],
		references: [{ commit: { id: 'cafebabe', repositoryUri: 'https://repo.url' }, ref: { name: 'refname', uri: 'https:ref.uri' } }],
		testInfo: {
			totalNumber: 0, numberPassed: 0, numberFailed: 0, numberSkipped: 0
		},
		schemaVersion: '1.0'
	}]
};

// You can paste the JWT into https://jwt.io to see its contents
const DEPLOYMENT_EVENT_JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJqZW5raW5zLWZvcmdlLWFwcCIsInJlcXVlc3RfYm9keV9qc29uIjoie1wicmVxdWVzdFR5cGVcIjpcImV2ZW50XCIsXCJldmVudFR5cGVcIjpcImRlcGxveW1lbnRcIixcInBpcGVsaW5lTmFtZVwiOlwicGlwZWxpbmVOYW1lXCIsXCJzdGF0dXNcIjpcInN1Y2Nlc3NmdWxcIixcImxhc3RVcGRhdGVkXCI6XCIyMDIyLTAzLTA3VDA2OjMwOjQ4Ljg3MDMwOVpcIixcInBheWxvYWRcIjp7XCJwcm9wZXJ0aWVzXCI6e1wic291cmNlXCI6XCJqZW5raW5zXCJ9LFwicHJvdmlkZXJNZXRhZGF0YVwiOntcInByb2R1Y3RcIjpcImplbmtpbnNcIn0sXCJkZXBsb3ltZW50c1wiOlt7XCJkZXBsb3ltZW50U2VxdWVuY2VOdW1iZXJcIjo0MixcInVwZGF0ZVNlcXVlbmNlTnVtYmVyXCI6NDUsXCJhc3NvY2lhdGlvbnNcIjpbe1widmFsdWVzXCI6W1wiSkVOLTI1XCJdLFwiYXNzb2NpYXRpb25UeXBlXCI6XCJpc3N1ZUtleXNcIn1dLFwiZGlzcGxheU5hbWVcIjpcInBpcGVsaW5lTmFtZVwiLFwidXJsXCI6XCJodHRwczovL3VybC5jb21cIixcImRlc2NyaXB0aW9uXCI6XCJkZXNjcmlwdGlvblwiLFwibGFzdFVwZGF0ZWRcIjpcIjIwMjItMDMtMDdUMDY6MzA6NDguODcwNTkzWlwiLFwibGFiZWxcIjpcImxhYmVsXCIsXCJzdGF0ZVwiOlwic3VjY2Vzc2Z1bFwiLFwicGlwZWxpbmVcIjp7XCJpZFwiOlwicGlwZWxpbmVJZFwiLFwiZGlzcGxheU5hbWVcIjpcInBpcGVsaW5lTmFtZVwiLFwidXJsXCI6XCJodHRwczovL3VybC5jb21cIn0sXCJlbnZpcm9ubWVudFwiOntcImlkXCI6XCJzdGctZWFzdFwiLFwiZGlzcGxheU5hbWVcIjpcIlN0YWdpbmcgZWFzdFwiLFwidHlwZVwiOlwic3RhZ2luZ1wifSxcInNjaGVtYVZlcnNpb25cIjpcIjEuMFwifV19LFwicGlwZWxpbmVJZFwiOlwicGlwZWxpbmVJZFwifSIsImlzcyI6ImplbmtpbnMtcGx1Z2luIiwiZXhwIjozMjQ3NDg0NTg0NywiaWF0IjoxNjQ2NjM0NjQ4fQ.D1JP5439A3CQ-8ys6gGCrMfhpeaFuMITaFwqSo86MbU';
const DEPLOYMENT_EVENT_PAYLOAD = {
	properties: { source: 'jenkins' },
	providerMetadata: { product: 'jenkins' },
	deployments: [{
		deploymentSequenceNumber: 42,
		updateSequenceNumber: 45,
		associations: [
			{ values: ['JEN-25'], associationType: 'issueKeys' }],
		displayName: 'pipelineName',
		url: 'https://url.com',
		description: 'description',
		lastUpdated: '2022-03-07T06:30:48.870593Z',
		label: 'label',
		state: 'successful',
		pipeline: { id: 'pipelineId', displayName: 'pipelineName', url: 'https://url.com' },
		environment: { id: 'stg-east', displayName: 'Staging east', type: 'staging' },
		schemaVersion: '1.0'
	}]
};

// You can paste the JWT into https://jwt.io to see its contents
const GATING_STATUS_JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJqZW5raW5zLWZvcmdlLWFwcCIsInJlcXVlc3RfYm9keV9qc29uIjoie1wicmVxdWVzdFR5cGVcIjpcImdhdGluZ1N0YXR1c1wiLFwiZGVwbG95bWVudElkXCI6XCI0NzExXCIsXCJwaXBlbGluZUlkXCI6XCIwODE1XCIsXCJlbnZpcm9ubWVudElkXCI6XCJwcm9kXCJ9IiwiaXNzIjoiamVua2lucy1wbHVnaW4iLCJleHAiOjMyNDc0ODI1MTMwLCJpYXQiOjE2NDczMDUxMzJ9.BTs3mEXBzLe9kyyc1rob1kELfrAOPwOUv4r_nhYbQSg';
const GATING_STATUS_PAYLOAD = {
	deploymentId: '4711',
	pipelineId: '0815',
	environmentId: 'prod'
};

// You can paste the JWT into https://jwt.io to see its contents
const PING_REQUEST_JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJqZW5raW5zLWZvcmdlLWFwcCIsInJlcXVlc3RfYm9keV9qc29uIjoie1wicmVxdWVzdFR5cGVcIjpcInBpbmdcIn0iLCJpc3MiOiJqZW5raW5zLXBsdWdpbiIsImV4cCI6MzI0NzQ4MTc2NzAsImlhdCI6MTY0Njc3OTI3MX0.YjNeVU2meBbOiyniGx_ILLmO9tpbwqIq4zpg93xOuXQ';

const INVALID_REQUEST_TYPE_JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJqZW5raW5zLWZvcmdlLWFwcCIsInJlcXVlc3RfYm9keV9qc29uIjoie1wicmVxdWVzdFR5cGVcIjpcImZvb1wiLFwiZXZlbnRUeXBlXCI6XCJkZXBsb3ltZW50XCIsXCJwaXBlbGluZU5hbWVcIjpcInBpcGVsaW5lTmFtZVwiLFwic3RhdHVzXCI6XCJzdWNjZXNzZnVsXCIsXCJsYXN0VXBkYXRlZFwiOlwiMjAyMi0wMy0wN1QwNzoxNDowNi44MzUzMjFaXCIsXCJwYXlsb2FkXCI6e1wicHJvcGVydGllc1wiOntcInNvdXJjZVwiOlwiamVua2luc1wifSxcInByb3ZpZGVyTWV0YWRhdGFcIjp7XCJwcm9kdWN0XCI6XCJqZW5raW5zXCJ9LFwiZGVwbG95bWVudHNcIjpbe1wiZGVwbG95bWVudFNlcXVlbmNlTnVtYmVyXCI6NDIsXCJ1cGRhdGVTZXF1ZW5jZU51bWJlclwiOjQ1LFwiYXNzb2NpYXRpb25zXCI6W3tcInZhbHVlc1wiOltcIkpFTi0yNVwiXSxcImFzc29jaWF0aW9uVHlwZVwiOlwiaXNzdWVLZXlzXCJ9XSxcImRpc3BsYXlOYW1lXCI6XCJwaXBlbGluZU5hbWVcIixcInVybFwiOlwiaHR0cHM6Ly91cmwuY29tXCIsXCJkZXNjcmlwdGlvblwiOlwiZGVzY3JpcHRpb25cIixcImxhc3RVcGRhdGVkXCI6XCIyMDIyLTAzLTA3VDA3OjE0OjA2LjgzNTgzN1pcIixcImxhYmVsXCI6XCJsYWJlbFwiLFwic3RhdGVcIjpcInN1Y2Nlc3NmdWxcIixcInBpcGVsaW5lXCI6e1wiaWRcIjpcInBpcGVsaW5lSWRcIixcImRpc3BsYXlOYW1lXCI6XCJwaXBlbGluZU5hbWVcIixcInVybFwiOlwiaHR0cHM6Ly91cmwuY29tXCJ9LFwiZW52aXJvbm1lbnRcIjp7XCJpZFwiOlwic3RnLWVhc3RcIixcImRpc3BsYXlOYW1lXCI6XCJTdGFnaW5nIGVhc3RcIixcInR5cGVcIjpcInN0YWdpbmdcIn0sXCJzY2hlbWFWZXJzaW9uXCI6XCIxLjBcIn1dfSxcInBpcGVsaW5lSWRcIjpcInBpcGVsaW5lSWRcIn0iLCJpc3MiOiJqZW5raW5zLXBsdWdpbiIsImV4cCI6MzI0NzQ4NDg0NDUsImlhdCI6MTY0NjYzNzI0Nn0.Ru6hmpDe7zkqqfaCZIxglsuoZqD1jCjf6UdcITPNaJ8';
const INVALID_EVENT_TYPE_JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJqZW5raW5zLWZvcmdlLWFwcCIsInJlcXVlc3RfYm9keV9qc29uIjoie1wicmVxdWVzdFR5cGVcIjpcImV2ZW50XCIsXCJldmVudFR5cGVcIjpcImZvb1wiLFwicGlwZWxpbmVOYW1lXCI6XCJwaXBlbGluZU5hbWVcIixcInN0YXR1c1wiOlwic3VjY2Vzc2Z1bFwiLFwibGFzdFVwZGF0ZWRcIjpcIjIwMjItMDMtMDdUMDc6MTc6MDUuODkwMDM4WlwiLFwicGF5bG9hZFwiOntcInByb3BlcnRpZXNcIjp7XCJzb3VyY2VcIjpcImplbmtpbnNcIn0sXCJwcm92aWRlck1ldGFkYXRhXCI6e1wicHJvZHVjdFwiOlwiamVua2luc1wifSxcImRlcGxveW1lbnRzXCI6W3tcImRlcGxveW1lbnRTZXF1ZW5jZU51bWJlclwiOjQyLFwidXBkYXRlU2VxdWVuY2VOdW1iZXJcIjo0NSxcImFzc29jaWF0aW9uc1wiOlt7XCJ2YWx1ZXNcIjpbXCJKRU4tMjVcIl0sXCJhc3NvY2lhdGlvblR5cGVcIjpcImlzc3VlS2V5c1wifV0sXCJkaXNwbGF5TmFtZVwiOlwicGlwZWxpbmVOYW1lXCIsXCJ1cmxcIjpcImh0dHBzOi8vdXJsLmNvbVwiLFwiZGVzY3JpcHRpb25cIjpcImRlc2NyaXB0aW9uXCIsXCJsYXN0VXBkYXRlZFwiOlwiMjAyMi0wMy0wN1QwNzoxNzowNS44OTAzNThaXCIsXCJsYWJlbFwiOlwibGFiZWxcIixcInN0YXRlXCI6XCJzdWNjZXNzZnVsXCIsXCJwaXBlbGluZVwiOntcImlkXCI6XCJwaXBlbGluZUlkXCIsXCJkaXNwbGF5TmFtZVwiOlwicGlwZWxpbmVOYW1lXCIsXCJ1cmxcIjpcImh0dHBzOi8vdXJsLmNvbVwifSxcImVudmlyb25tZW50XCI6e1wiaWRcIjpcInN0Zy1lYXN0XCIsXCJkaXNwbGF5TmFtZVwiOlwiU3RhZ2luZyBlYXN0XCIsXCJ0eXBlXCI6XCJzdGFnaW5nXCJ9LFwic2NoZW1hVmVyc2lvblwiOlwiMS4wXCJ9XX0sXCJwaXBlbGluZUlkXCI6XCJwaXBlbGluZUlkXCJ9IiwiaXNzIjoiamVua2lucy1wbHVnaW4iLCJleHAiOjMyNDc0ODQ4NjI0LCJpYXQiOjE2NDY2Mzc0MjV9.PI6VQoXC4DV9EIvdoZqTJrv6h11h5hSFVYrnyigTrLA';

const context: ForgeTriggerContext = {
	installContext: `ari:cloud:jira::site/${CLOUD_ID}`
};

describe('Jenkins webtrigger', () => {
	const givenStorageReturnsJenkinsServerSecret = (secret?: string) => {
		when(storage.getSecret).calledWith(expect.stringMatching(`${SECRET_STORAGE_KEY_PREFIX}${JENKINS_SERVER_UUID}`))
			.mockResolvedValue(secret || 'this is a secret');
	};

	const givenStorageReturnsJenkinsServer = () => {
		when(storage.get).calledWith(expect.stringMatching(`${SERVER_STORAGE_KEY_PREFIX}${JENKINS_SERVER_UUID}`))
			.mockResolvedValue({
				uuid: JENKINS_SERVER_UUID,
				name: 'Jenkins Server',
				pipelines: []
			});
	};

	const givenJiraRespondsToEvent = (
		eventType: EventType,
		expectedJiraRequest: any,
		jiraResponse: JiraResponse
	) => {
		when(sendEventToJira).calledWith(
			expect.stringMatching(eventType),
			expect.stringMatching(CLOUD_ID),
			expect.objectContaining({
				...expectedJiraRequest,
				properties: {
					...expectedJiraRequest.properties,
					cloudId: expect.any(String),
					jenkinsServerUuid: expect.any(String)
				}
			})
		).mockResolvedValue(jiraResponse);
	};

	const givenJiraRespondsToGatingStatus = (
		expectedDeploymentId: string,
		expectedPipelineId: string,
		expectedEnvironmentId: string,
		jiraResponse: JiraResponse
	) => {
		when(getGatingStatusFromJira).calledWith(
			expect.stringMatching(CLOUD_ID),
			expect.stringMatching(expectedDeploymentId),
			expect.stringMatching(expectedPipelineId),
			expect.stringMatching(expectedEnvironmentId)
		).mockResolvedValue(jiraResponse);
	};

	const createJiraResponse = (status: number) => ({
		status,
		body: {
			success: true
		}
	});

	const createWebtriggerRequest = (jwt: string) => ({
		queryParameters: {
			jenkins_server_uuid: [JENKINS_SERVER_UUID]
		},
		body: jwt
	});

	it('should return 400 on missing UUID param', async () => {
		const requestWithoutParam: WebtriggerRequest = {
			queryParameters: {},
			body: ''
		};

		const response: WebtriggerResponse = await handleJenkinsRequest(requestWithoutParam, context);
		expect(response.statusCode).toBe(400);
	});

	it('should send a build event to Jira and return the Jira response', async () => {
		// given
		const jiraResponse = createJiraResponse(200);
		givenStorageReturnsJenkinsServerSecret();
		givenStorageReturnsJenkinsServer();
		givenJiraRespondsToEvent(EventType.BUILD, BUILD_EVENT_PAYLOAD, jiraResponse);

		// when
		const response: WebtriggerResponse = await handleJenkinsRequest(createWebtriggerRequest(BUILD_EVENT_JWT), context);

		// then
		expect(response.statusCode).toBe(jiraResponse.status);
		expect(response.body).toBe(JSON.stringify(jiraResponse.body));
	});

	it('should send a deployment event to Jira and return the Jira response', async () => {
		// given
		const jiraResponse = createJiraResponse(200);
		givenStorageReturnsJenkinsServerSecret();
		givenStorageReturnsJenkinsServer();
		givenJiraRespondsToEvent(EventType.DEPLOYMENT, DEPLOYMENT_EVENT_PAYLOAD, jiraResponse);

		// when
		const response: WebtriggerResponse =
        await handleJenkinsRequest(createWebtriggerRequest(DEPLOYMENT_EVENT_JWT), context);

		// then
		expect(response.statusCode).toBe(jiraResponse.status);
		expect(response.body).toBe(JSON.stringify(jiraResponse.body));
	});

	it('should return 400 on invalid request type', async () => {
		// given
		givenStorageReturnsJenkinsServerSecret();
		givenStorageReturnsJenkinsServer();

		// when
		const response: WebtriggerResponse =
        await handleJenkinsRequest(createWebtriggerRequest(INVALID_REQUEST_TYPE_JWT), context);

		// then
		expect(response.statusCode).toBe(400);
		expect(response.body).toBe('unsupported request type foo');
	});

	it('should return 400 on invalid event type', async () => {
		// given
		givenStorageReturnsJenkinsServerSecret();
		givenStorageReturnsJenkinsServer();

		// when
		const response: WebtriggerResponse =
        await handleJenkinsRequest(createWebtriggerRequest(INVALID_EVENT_TYPE_JWT), context);

		// then
		expect(response.statusCode).toBe(400);
		expect(response.body).toBe('invalid event type: foo');
	});

	it('should return a 200 on valid ping request', async () => {
		// given
		givenStorageReturnsJenkinsServerSecret();
		givenStorageReturnsJenkinsServer();

		// when
		const response: WebtriggerResponse = await handleJenkinsRequest(createWebtriggerRequest(PING_REQUEST_JWT), context);

		// then
		expect(response.statusCode).toBe(200);
		expect(response.body).toBe('{"success": true}');
	});

	it('should return a 400 on invalid ping request', async () => {
		// given
		givenStorageReturnsJenkinsServerSecret('invalid secret');
		givenStorageReturnsJenkinsServer();

		// when
		const response: WebtriggerResponse = await handleJenkinsRequest(createWebtriggerRequest(BUILD_EVENT_JWT), context);

		// then
		expect(response.statusCode).toBe(400);
		expect(response.body).toBe('JWT verification failed. Please make sure you configured the same secret in Jenkins and Jira.');
	});

	it('should request gating status from Jira', async () => {
		// given
		givenStorageReturnsJenkinsServerSecret();
		givenStorageReturnsJenkinsServer();
		givenJiraRespondsToGatingStatus(
			GATING_STATUS_PAYLOAD.deploymentId,
			GATING_STATUS_PAYLOAD.pipelineId,
			GATING_STATUS_PAYLOAD.environmentId,
			createJiraResponse(200)
		);

		// when
		const response: WebtriggerResponse = await handleJenkinsRequest(
			createWebtriggerRequest(GATING_STATUS_JWT),
			context
		);

		// then
		expect(response.statusCode).toBe(200);
	});

	it('should override cloudId and jenkinsServerUuid properties properly', async () => {
		// given
		const jiraResponse = createJiraResponse(200);
		givenStorageReturnsJenkinsServerSecret();
		givenStorageReturnsJenkinsServer();
		givenJiraRespondsToEvent(EventType.BUILD, BUILD_EVENT_PAYLOAD, jiraResponse);

		await handleJenkinsRequest(createWebtriggerRequest(BUILD_EVENT_JWT), context);

		expect(sendEventToJira).toBeCalledWith(
			EventType.BUILD,
			CLOUD_ID,
			expect.objectContaining({
				...BUILD_EVENT_PAYLOAD,
				properties: {
					...BUILD_EVENT_PAYLOAD.properties,
					cloudId: CLOUD_ID,
					jenkinsServerUuid: JENKINS_SERVER_UUID
				}
			})
		);
	});
});
