import { ApiCall, buildApiCall } from '@/api';
import { APIChannelArray } from '@/schemas/responses';
import route from 'meta:api(./src/api)';

export const getChannel = (server: string, channel_id: string) =>
    (buildApiCall({
        route: route.replace('#channel_id', channel_id),
        method: 'GET',
        chaptchaRequired(response) {
        },
    }) satisfies ApiCall<never, APIChannelArray[number]>)(server);
