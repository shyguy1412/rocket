import { ApiCall, buildApiCall } from '@/api';
import { APIMessageArray } from '@/schemas/responses';
import { MessageCreateSchema } from '@/schemas/uncategorised';
import route from 'meta:api(./src/api)';

export const getMessages = (channel_id: string) =>
    (buildApiCall({
        route: route.replace('#channel_id', channel_id),
        method: 'GET',
        chaptchaRequired(response) {
        },
    }) satisfies ApiCall<never, APIMessageArray>)();

export const sendMessage = (channel_id: string, body: MessageCreateSchema) =>
    (buildApiCall({
        route: route.replace('#channel_id', channel_id),
        method: 'POST',
        chaptchaRequired(response) {
        },
    }) satisfies ApiCall<MessageCreateSchema, APIMessageArray[number]>)(body);
