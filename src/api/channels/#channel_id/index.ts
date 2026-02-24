import { buildApiCall } from '@/api';
import { APIChannelArray } from '@/schemas/responses';
import route from 'meta:api(./src/api)';

export const getChannel = buildApiCall<
    [channel_id: string],
    undefined,
    undefined,
    APIChannelArray[number]
>({
    route,
    method: 'GET',
});
