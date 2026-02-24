import { buildApiCall } from '@/api';
import { TokenOnlyResponse } from '@/schemas/responses';
import { RegisterSchema } from '@/schemas/uncategorised';
import route from 'meta:api(./src/api)';

export const register = buildApiCall<
    [],
    undefined,
    RegisterSchema,
    TokenOnlyResponse
>({
    route,
    method: 'POST',
    chaptchaRequired(response) {
    },
});
