import { extractBodyFromJwt, verifyJwt } from './jwt';
import { InvalidPayloadError, JwtVerificationFailedError } from '../common/error';
import { JenkinsEvent } from './types';
import { EventType } from '../common/types';

// this JWT has been generated from JenkinsAppApiTest.generateExampleJwt() in the Jenkins plugin
const VALID_JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJqZW5raW5zLWZvcmdlLWFwcCIsInJlcXVlc3RfYm9keV9qc29uIjoie1wicmVxdWVzdFR5cGVcIjpcImV2ZW50XCIsXCJldmVudFR5cGVcIjpcImJ1aWxkXCIsXCJwaXBlbGluZU5hbWVcIjpcInBpcGVsaW5lTmFtZVwiLFwic3RhdHVzXCI6XCJzdWNjZXNzZnVsXCIsXCJsYXN0VXBkYXRlZFwiOlwiMjAyMi0wMy0wN1QwNDozOTozMy4xNDE5NjNaXCIsXCJwYXlsb2FkXCI6e1wicHJvcGVydGllc1wiOntcInNvdXJjZVwiOlwiamVua2luc1wifSxcInByb3ZpZGVyTWV0YWRhdGFcIjp7XCJwcm9kdWN0XCI6XCJqZW5raW5zXCJ9LFwiYnVpbGRzXCI6W3tcInBpcGVsaW5lSWRcIjpcInBpcGVsaW5lSWRcIixcImJ1aWxkTnVtYmVyXCI6MTIsXCJ1cGRhdGVTZXF1ZW5jZU51bWJlclwiOjEyLFwiZGlzcGxheU5hbWVcIjpcInBpcGVsaW5lTmFtZVwiLFwiZGVzY3JpcHRpb25cIjpcImRlc2NyaXB0aW9uXCIsXCJsYWJlbFwiOlwibGFiZWxcIixcInVybFwiOlwiaHR0cHM6Ly91cmwuY29tXCIsXCJzdGF0ZVwiOlwic3VjY2Vzc2Z1bFwiLFwibGFzdFVwZGF0ZWRcIjpcIjIwMjItMDMtMDdUMDQ6Mzk6MzMuMTQyMjAxWlwiLFwiaXNzdWVLZXlzXCI6W1wiSkVOLTI1XCJdLFwicmVmZXJlbmNlc1wiOlt7XCJjb21taXRcIjp7XCJpZFwiOlwiY2FmZWJhYmVcIixcInJlcG9zaXRvcnlVcmlcIjpcImh0dHBzOi8vcmVwby51cmxcIn0sXCJyZWZcIjp7XCJuYW1lXCI6XCJyZWZuYW1lXCIsXCJ1cmlcIjpcImh0dHBzOnJlZi51cmlcIn19XSxcInRlc3RJbmZvXCI6e1widG90YWxOdW1iZXJcIjowLFwibnVtYmVyUGFzc2VkXCI6MCxcIm51bWJlckZhaWxlZFwiOjAsXCJudW1iZXJTa2lwcGVkXCI6MH0sXCJzY2hlbWFWZXJzaW9uXCI6XCIxLjBcIn1dfSxcInBpcGVsaW5lSWRcIjpcInBpcGVsaW5lSWRcIn0iLCJpc3MiOiJqZW5raW5zLXBsdWdpbiIsImV4cCI6MzI0NzQ4MzkxNzEsImlhdCI6MTY0NjYyNzk3M30.N5ZcLeoBVLlnZYok0AWqzYkxoS-O3vBilmiOXoobiko';
const EXPIRED_JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJqZW5raW5zLWZvcmdlLWFwcCIsInJlcXVlc3RfYm9keV9qc29uIjoie1wicmVxdWVzdFR5cGVcIjpcImV2ZW50XCIsXCJldmVudFR5cGVcIjpcImJ1aWxkXCIsXCJwaXBlbGluZU5hbWVcIjpcInBpcGVsaW5lTmFtZVwiLFwic3RhdHVzXCI6XCJzdWNjZXNzXCIsXCJsYXN0VXBkYXRlZFwiOlwiMjAyMi0wMy0wN1QwMjoxMzoxNS43MzUzMTJaXCIsXCJwYXlsb2FkXCI6e1wicHJvcGVydGllc1wiOntcInNvdXJjZVwiOlwiamVua2luc1wifSxcInByb3ZpZGVyTWV0YWRhdGFcIjp7XCJwcm9kdWN0XCI6XCJqZW5raW5zXCJ9LFwiYnVpbGRzXCI6W3tcInBpcGVsaW5lSWRcIjpcInBpcGVsaW5lSWRcIixcImJ1aWxkTnVtYmVyXCI6MTIsXCJ1cGRhdGVTZXF1ZW5jZU51bWJlclwiOjEyLFwiZGlzcGxheU5hbWVcIjpcInBpcGVsaW5lTmFtZVwiLFwiZGVzY3JpcHRpb25cIjpcImRlc2NyaXB0aW9uXCIsXCJsYWJlbFwiOlwibGFiZWxcIixcInVybFwiOlwiaHR0cHM6Ly91cmwuY29tXCIsXCJzdGF0ZVwiOlwic3VjY2Vzc2Z1bFwiLFwibGFzdFVwZGF0ZWRcIjpcIjIwMjItMDMtMDdUMDI6MTM6MTUuNzM1NTQyWlwiLFwiaXNzdWVLZXlzXCI6W1wiSkVOLTI1XCJdLFwicmVmZXJlbmNlc1wiOlt7XCJjb21taXRcIjp7XCJpZFwiOlwiY2FmZWJhYmVcIixcInJlcG9zaXRvcnlVcmlcIjpcImh0dHBzOi8vcmVwby51cmxcIn0sXCJyZWZcIjp7XCJuYW1lXCI6XCJyZWZuYW1lXCIsXCJ1cmlcIjpcImh0dHBzOnJlZi51cmlcIn19XSxcInRlc3RJbmZvXCI6e1widG90YWxOdW1iZXJcIjowLFwibnVtYmVyUGFzc2VkXCI6MCxcIm51bWJlckZhaWxlZFwiOjAsXCJudW1iZXJTa2lwcGVkXCI6MH0sXCJzY2hlbWFWZXJzaW9uXCI6XCIxLjBcIn1dfSxcInBpcGVsaW5lSWRcIjpcInBpcGVsaW5lSWRcIn0iLCJpc3MiOiJqZW5raW5zLXBsdWdpbiIsImV4cCI6MTY0NjYxOTQ5NSwiaWF0IjoxNjQ2NjE5MTk1fQ.986aiaKHAtLFZIs9zxVaPDQMqZcA2etfzpdYc6rbgn8';
const INVALID_JWT = 'BpcGVsaW5lTmFtZVwiLFwic3RhdHVzXCI6XCJzdWNjZXNzZnVsXCIsXCJsYXN0VXBkYXRlZFwiOlwiMjAyMi0wMi0yNFQwNToyNDozNi43NjdaXCIsXCJwYXlsb2FkXCI6e1wicHJvcGVydGllc1wiOntcInNvdXJjZVwiOlwiamVua2luc1wifSxcInByb3ZpZGVyTWV0YWRhdGFcIjp7XCJwcm9kdWN0XCI6XCJqZW5raW5zXCJ9LFwiYnVpbGRzXCI6W3tcInBpcGVsaW5lSWRcIjpcInBpcGVsaW5lSWRcIixcImJ1aWxkTnVtYmVyXCI6MTIsXCJ1cGRhdGVTZXF1ZW5jZU51bWJlclwiOjEyLFwiZGlzcGxheU5hbWVcIjpcInBpcGVsaW5lTmFtZVwiLFwiZGVzY3JpcHRpb25cIjpcImRlc2NyaXB0aW9uXCIsXCJsYWJlbFwiOlwibGFiZWxcIixcInVybFwiOlwiaHR0cHM6Ly91cmwuY29tXCIsXCJzdGF0ZVwiOlwic3VjY2Vzc2Z1bFwiLFwibGFzdFVwZGF0ZWRcIjpcIjIwMjItMDItMjRUMDU6MjQ6MzYuNzY3WlwiLFwiaXNzdWVLZXlzXCI6W1wiSkVOLTI1XCJdLFwicmVmZXJlbmNlc1wiOlt7XCJjb21taXRcIjp7XCJpZFwiOlwiY2FmZWJhYmVcIixcInJlcG9zaXRvcnlVcmlcIjpcImh0dHBzOi8vcmVwby51cmxcIn0sXCJyZWZcIjp7XCJuYW1lXCI6XCJyZWZuYW1lXCIsXCJ1cmlcIjpcImh0dHBzOnJlZi51cmlcIn19XSxcInRlc3RJbmZvXCI6e1widG90YWxOdW1iZXJcIjowLFwibnVtYmVyUGFzc2VkXCI6MCxcIm51bWJlckZhaWxlZFwiOjAsXCJudW1iZXJTa2lwcGVkXCI6MH0sXCJzY2hlbWFWZXJzaW9uXCI6XCIxLjBcIn1dfSxcInBpcGVsaW5lSWRcIjpcInBpcGVsaW5lSWRcIn0iLCJpc3MiOiJqZW5raW5zLXBsdWdpbiIsImV4cCI6MTY0NjYxNzUyOCwiaWF0FOOjoxNjQ2NjE3MjI4fQ.XHvwRCsSmb_YmY9yLzSH8L8KMjRe8wOyu1CVfzmDx9I';
const CLAIMS = {
	algorithms: ['HS256'],
	issuer: 'jenkins-plugin',
	audience: 'jenkins-forge-app'
};
describe('JWT', () => {
	describe('verifyJwt()', () => {
		it('should verify a valid JWT', async () => {
			expect(
				() => verifyJwt(VALID_JWT, 'this is a secret', CLAIMS)
			).not.toThrow();
		});

		it('should not verify a JWT with a wrong secret', async () => {
			expect(
				() => verifyJwt(VALID_JWT, 'this is not the correct secret', CLAIMS)
			).toThrow(JwtVerificationFailedError);
		});

		it('should not verify an expired JWT', async () => {
			expect(
				() => verifyJwt(EXPIRED_JWT, 'this is a secret', CLAIMS)
			).toThrow(JwtVerificationFailedError);
		});

		it('should not verify a JWT with invalid format', async () => {
			expect(
				() => verifyJwt(INVALID_JWT, 'this is a secret', CLAIMS)
			).toThrow(JwtVerificationFailedError);
		});
	});

	describe('extractBodyFromJwt()', () => {
		it('should extract the body from a valid JWT', async () => {
			const event = extractBodyFromJwt(VALID_JWT) as JenkinsEvent;
			expect(event.eventType).toBe(EventType.BUILD);
		});

		it('should not extract the body from an invalid JWT', async () => {
			expect(
				() => extractBodyFromJwt(INVALID_JWT) as JenkinsEvent
			).toThrow(InvalidPayloadError);
		});
	});
});
