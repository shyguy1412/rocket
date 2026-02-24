import { buildApiCall } from '@/api';
import { APIGuildArray } from '@/schemas/responses';
import route from 'meta:api(./src/api)';

export const getGuilds = buildApiCall<
    [],
    undefined,
    undefined,
    APIGuildArray
>({
    route,
    method: 'GET',
});
