import { Errors } from '../common/error-messages';
import { sendEventToJira } from './send-event-to-jira';
import { EventType } from '../common/types';

describe('deleteDeployments suite', () => {
    it('Should throw an error if no eventType is passed', async () => {
        (global as any).api = {
            asApp: () => ({
                __requestAtlassian: () => ({}),
            })
        };

        try {
            // @ts-ignore
            await sendEventToJira(null, '1234', { thing: 'value' });
        } catch (e) {
            // @ts-ignore
            expect(e.toString()).toEqual((`Error: ${Errors.MISSING_REQUIRED_PROPERTIES}`));
        }
    });

    it('Should throw an error if no cloudId is passed', async () => {
        (global as any).api = {
            asApp: () => ({
                __requestAtlassian: () => ({}),
            })
        };

        try {
            // @ts-ignore
            await sendEventToJira(EventType.BUILD, null, { thing: 'value' });
        } catch (e) {
            // @ts-ignore
            expect(e.toString()).toEqual((`Error: ${Errors.MISSING_REQUIRED_PROPERTIES}`));
        }
    });

    it('Should throw an error if no payload is passed', async () => {
        (global as any).api = {
            asApp: () => ({
                __requestAtlassian: () => ({}),
            })
        };

        try {
            // @ts-ignore
            await sendEventToJira(EventType.BUILD, '1234', null);
        } catch (e) {
            // @ts-ignore
            expect(e.toString()).toEqual((`Error: ${Errors.MISSING_REQUIRED_PROPERTIES}`));
        }
    });

    it('Should throw an error when invalid eventType is passes', async () => {
        (global as any).api = {
            asApp: () => ({
                __requestAtlassian: () => ({}),
            })
        };

        try {
            // @ts-ignore
            await sendEventToJira('random event type', '1234', { thing: 'value' });
        } catch (e) {
            // @ts-ignore
            expect(e.toString()).toEqual((`Error: ${Errors.INVALID_EVENT_TYPE}`));
        }
    });

    it('Should return status with empty body if no responseString is returned', async () => {
        (global as any).api = {
            asApp: () => ({
                __requestAtlassian: () => ({ status: 200, text: jest.fn() }),
            })
        };

        const response = await sendEventToJira(EventType.BUILD, '1234', { thing: 'value' });
        expect(response).toEqual({ status: 200, body: {} });
    });

    it('Should return status with response body when responseString is returned', async () => {
        (global as any).api = {
            asApp: () => ({
                __requestAtlassian: () => ({
                    status: 200,
                    text: jest.fn(() => {
                        return Promise.resolve(JSON.stringify({
                            text: 'some message'
                        }));
                    })
                }),
            })
        };

        const response = await sendEventToJira(EventType.DEPLOYMENT, '1234', { thing: 'value' });
        expect(response).toEqual({ status: 200, body: { text: 'some message' } });
    });
});
