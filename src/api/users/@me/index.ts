import { ApiCall, buildApiCall } from '@/api';
import { PrivateUser } from '@/schemas/api';
import route from 'meta:api(./src/api)';

export const get_me = buildApiCall({
    route,
    method: 'GET',
    chaptchaRequired(response) {
    },
}) satisfies ApiCall<never, PrivateUser>;
