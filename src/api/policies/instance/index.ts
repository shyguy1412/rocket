import { buildApiCall } from '@/api';
import { APIGeneralConfiguration } from '@/schemas/index';
import route from 'meta:api(./src/api)';

export const getInstanceConfig = buildApiCall<
    [],
    undefined,
    undefined,
    APIGeneralConfiguration
>({
    route,
    method: 'GET',
});
