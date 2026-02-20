import { ApiCall, buildApiCall } from '@/api';
import { APIGuildArray } from '@/schemas/responses';
import route from 'meta:api(./src/api)';

export const getGuilds = buildApiCall({
    route,
    method: 'GET',
    chaptchaRequired(response) {
    },
}) satisfies ApiCall<never, APIGuildArray>;
