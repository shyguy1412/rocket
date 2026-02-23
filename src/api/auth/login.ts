import { buildApiCall, EndpointCall } from '@/api';
import { LoginResponse, LoginSchema } from '@/schemas/uncategorised';
import route from 'meta:api(./src/api)';

export const login = buildApiCall({
    route,
    method: 'POST',
}) satisfies EndpointCall<LoginSchema, LoginResponse>;
