import { buildApiCall, EndpointCall } from '@/api';
import { PrivateUser } from '@/schemas/api';
import route from 'meta:api(./src/api)';

export const getMe = buildApiCall({
    route,
    method: 'GET',
    chaptchaRequired(response) {
    },
}) satisfies EndpointCall<never, PrivateUser>;
