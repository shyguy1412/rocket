import { buildApiCall, EndpointCall } from '@/api';
import { APIChannelArray } from '@/schemas/responses';
import route from 'meta:api(./src/api)';

export const getChannel = (server: string, channel_id: string, token?: string) =>
    (buildApiCall({
        route: route.replace('#channel_id', channel_id),
        method: 'GET',
        chaptchaRequired(response) {
        },
    }) satisfies EndpointCall<never, APIChannelArray[number]>)(server, undefined, token);
