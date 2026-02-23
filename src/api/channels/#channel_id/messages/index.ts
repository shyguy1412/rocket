import { buildApiCall, EndpointCall } from '@/api';
import { APIMessageArray } from '@/schemas/responses';
import { MessageCreateSchema } from '@/schemas/uncategorised';
import route from 'meta:api(./src/api)';

export const getMessages = (server: string, channel_id: string, token: string) =>
    (buildApiCall({
        route: route.replace('#channel_id', channel_id),
        method: 'GET',
        chaptchaRequired(response) {
        },
    }) satisfies EndpointCall<never, APIMessageArray>)(server, undefined, token);

export const sendMessage = (
    server: string,
    channel_id: string,
    body: MessageCreateSchema,
    token: string,
) => (buildApiCall({
    route: route.replace('#channel_id', channel_id),
    method: 'POST',
    chaptchaRequired(response) {
    },
}) satisfies EndpointCall<MessageCreateSchema, APIMessageArray[number]>)(
    server,
    body,
    token,
);
