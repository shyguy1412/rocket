import { buildApiCall, EndpointCall } from '@/api';
import { TokenOnlyResponse } from '@/schemas/responses';
import { RegisterSchema } from '@/schemas/uncategorised';
import route from 'meta:api(./src/api)';

export const register = buildApiCall({
    route,
    method: 'POST',
    chaptchaRequired(response) {
    },
}) satisfies EndpointCall<RegisterSchema, TokenOnlyResponse>;
