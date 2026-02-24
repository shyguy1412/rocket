import { buildApiCall } from '@/api';
import { PrivateUser } from '@/schemas/api';
import route from 'meta:api(./src/api)';

export const getMe = buildApiCall<
    [],
    undefined,
    undefined,
    PrivateUser
>({
    route,
    method: 'GET',
    chaptchaRequired(response) {
    },
});
