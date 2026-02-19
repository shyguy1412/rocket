import { ApiCall, buildApiCall } from '@/api';
import { APIGuildArray, PreloadMessagesResponseSchema } from '@/schemas/responses';
import { PreloadMessagesRequestSchema } from '@/schemas/uncategorised';
import route from 'meta:api(./src/api)';

export const preloadMessages = buildApiCall({
    route,
    method: 'POST',
    chaptchaRequired(response) {
    },
}) satisfies ApiCall<PreloadMessagesRequestSchema, PreloadMessagesResponseSchema>;
