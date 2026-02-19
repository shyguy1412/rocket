import { Result } from '@/lib/types/Result';
import {
    APIErrorOrCaptchaResponse,
    APIErrorResponse,
    CaptchaRequiredResponse,
} from '@/schemas/responses';

const API_SERVER = 'https://rory.server.spacebar.chat/api/v9';

export type ApiResult<T> = Result<T, APIError>;
export type ApiResponse<R, E = APIErrorOrCaptchaResponse> = {
    headers: Headers;
    status: number;
    body: R | E;
};

export type Endpoint = {
    route: string;
    method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTION' | 'PATCH';
    chaptchaRequired?: (response: CaptchaRequiredResponse) => unknown;
};

export type ApiCall<B, R = unknown> = (
    body: B,
) => Promise<ApiResult<R>>;

export const buildApiCall = <B, R>(endpoint: Endpoint) =>
async (
    ...[body]: B[]
): Promise<Result<R, APIError>> => {
    const { route, method, chaptchaRequired } = endpoint;

    const request = fetch(`${API_SERVER}${route}`, {
        method,
        headers: {
            Authorization: localStorage.getItem('token') ?? '',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }).then(async (response) => ({
        headers: response.headers,
        status: response.status,
        body: await response.json(),
    }));

    const result = await Result.fromPromise(request);

    return result
        .andThen((response) => {
            const intermediate = parseResponse<R>(
                response,
                chaptchaRequired,
            );
            return intermediate;
        })
        .mapErr((err) => parseError(err));
};

function parseResponse<T>(
    response: ApiResponse<T>,
    captchaCallback: Endpoint['chaptchaRequired'],
): ApiResult<T> {
    if (isCaptchaRequiredResponse(response)) {
        captchaCallback?.(response.body);
        return Result.Err({
            code: 0,
            message: 'Captcha Required',
            errors: [],
        });
    }

    if (isErrorResponse(response)) {
        return Result.Err(formatAPIErrorResponse(response.body));
    }

    console.log(response);

    // TS seems to struggle with discrimination. Get more racist ffs
    return Result.Ok(response.body as T);
}

export type APIError = {
    code: number;
    message: string;
    errors: {
        property: string;
        code: string;
        message: string;
    }[];
};

function formatAPIErrorResponse(err: APIErrorResponse): APIError {
    return {
        code: err.code,
        message: err.message,
        errors: Object.entries(err.errors ?? {}).flatMap(([property, errors]) =>
            errors._errors.map((e) => ({ property, ...e }))
        ),
    };
}

function parseError(err: APIError | Error): APIError {
    if (!(err instanceof Error)) {
        return err;
    }

    return {
        code: -1,
        message: err.message,
        errors: [],
    };
}

function isCaptchaRequiredResponse(
    response: ApiResponse<any>,
): response is ApiResponse<never, CaptchaRequiredResponse> {
    return 'captcha_key' in response.body;
}

function isErrorResponse(
    response: ApiResponse<any>,
): response is ApiResponse<never, APIErrorResponse> {
    return response.status > 300;
}
