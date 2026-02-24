import { buildApiCall } from '@/api';
import { LoginResponse, LoginSchema } from '@/schemas/uncategorised';
import route from 'meta:api(./src/api)';

export const login = buildApiCall<
    [],
    undefined,
    LoginSchema,
    LoginResponse
>({
    route,
    method: 'POST',
});
