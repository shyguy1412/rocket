import { buildApiCall, EndpointCall } from '@/api';
import { APIChannelArray } from '@/schemas/responses';
import route from 'meta:api(./src/api)';

export const getChannels = (server: string, guild_id: string, token?: string) =>
    (buildApiCall({
        route: route.replace('#guild_id', guild_id),
        method: 'GET',
        chaptchaRequired(response) {
        },
    }) satisfies EndpointCall<never, APIChannelArray>)(server, undefined, token);
