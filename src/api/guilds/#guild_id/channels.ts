import { ApiCall, buildApiCall } from '@/api';
import { APIChannelArray } from '@/schemas/responses';
import route from 'meta:api(./src/api)';

export const getChannel = (server: string, guild_id: string) =>
    (buildApiCall({
        route: route.replace('#guild_id', guild_id),
        method: 'GET',
        chaptchaRequired(response) {
        },
    }) satisfies ApiCall<never, APIChannelArray>)(server);
