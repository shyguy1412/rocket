import { ApiCall, buildApiCall } from '@/api';
import { APIGuildArray } from '@/schemas/responses';
import route from 'meta:api(./src/api)';

export const get_guilds = buildApiCall({
    route,
    method: 'GET',
    chaptchaRequired(response) {
    },
}) satisfies ApiCall<never, APIGuildArray>;
