import { buildApiCall } from '@/api';
import { APIMessageArray } from '@/schemas/responses';
import { MessageCreateSchema } from '@/schemas/uncategorised';
import route from 'meta:api(./src/api)';

export const getMessages = buildApiCall<
    [channel_id: string],
    undefined,
    undefined,
    APIMessageArray
>({
    route,
    method: 'GET',
});

export const sendMessage = buildApiCall<
    [channel_id: string],
    undefined,
    MessageCreateSchema,
    APIMessageArray[number]
>({
    route,
    method: 'POST',
});
