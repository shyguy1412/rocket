import { buildApiCall } from '@/api';
import { APIChannelArray } from '@/schemas/responses';
import route from 'meta:api(./src/api)';

export const getChannels = buildApiCall<
    [guild_id: string],
    undefined,
    undefined,
    APIChannelArray
>({
    route,
    method: 'GET',
});
