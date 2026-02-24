import { Result } from '@/lib/types/Result';
import { useProfile } from '@/render/store/Profile';

import {
    APIErrorOrCaptchaResponse,
    APIErrorResponse,
    CaptchaRequiredResponse,
} from '@/schemas/responses';

import { useCallback } from 'preact/hooks';

export type ApiResult<T> = Result<T, APIError>;
export type APIError = {
    code: number;
    message: string;
    errors: {
        property: string;
        code: string;
        message: string;
    }[];
    body?: CaptchaRequiredResponse;
};

export type ApiResponse<R, E = APIErrorOrCaptchaResponse> = {
    headers: Headers;
    status: number;
    body: R | E;
};

type ApiCallParameters<
    P extends string[],
    Q extends Record<string, string> | undefined,
    B,
> = [
    instance: string,
    ...ApiCallData<P, Q, B>,
    token?: string,
];

type ApiCallData<
    P extends string[],
    Q extends Record<string, string> | undefined,
    B,
> = [
    ...(P extends [] ? [] : P),
    ...(Q extends undefined ? [] : [query: Q]),
    ...(B extends undefined ? [] : [body: B]),
];

export type ApiCall<
    P extends string[],
    Q extends Record<string, string> | undefined,
    B,
    R,
> = (
    ...args: ApiCallParameters<P, Q, B>
) => Promise<ApiResult<R>>;

export type HookedApiCall<
    P extends string[],
    Q extends Record<string, string> | undefined,
    B,
    R,
> = (...args: ApiCallData<P, Q, B>) => Promise<ApiResult<R>>;

export type Endpoint = {
    route: string;
    method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTION' | 'PATCH';
    chaptchaRequired?: (response: CaptchaRequiredResponse) => unknown;
};

export function buildApiCall<
    P extends string[],
    Q extends Record<string, string> | undefined,
    B,
    R,
>(endpoint: Endpoint): ApiCall<P, Q, B, R> {
    return (...args) => {
        const instance = args.shift() as string;

        const route = endpoint.route.replaceAll(
            /(#[A-Za-z0-9_]*)/g,
            () => args.shift() as string,
        );

        const token = typeof args.at(-1) == 'string' ? args.pop() as string : '';

        let [query = {}, body] = args.slice() as [Q, B];

        if (endpoint.method != 'GET' && body == undefined) {
            body = query as B;
            query = {};
        }

        const queryParams = Object.entries(query).reduce(
            (prev, [p, v]) => prev + `${p}=${encodeURI(v)}`,
            '',
        );

        const url = `${instance}/api/v9${route}?${queryParams}`;

        console.log(url, body);

        return genericApiCall<B, R>(url, endpoint.method, body, token).then((r) => {
            if (r.isOk()) {
                return r;
            }
            if (r.error.code != 0) {
                return r;
            }
            endpoint.chaptchaRequired?.(r.error.body!);
            return r;
        });
    };
}
const genericApiCall = async <B, R>(
    url: string,
    method: string,
    body?: B,
    token?: string,
): Promise<ApiResult<R>> => {
    const request = fetch(url, {
        method,
        headers: {
            Authorization: token ?? '',
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
        .andThen(parseResponse<R>)
        .mapErr(parseError);
};

/**
 * Wraps an API call with the credentials provided by the current context
 * @param call api call to wrap
 * @returns api call bound to the current instance and profile
 */
export function useApi<
    P extends string[],
    Q extends Record<string, string> | undefined,
    B,
    R,
>(call: ApiCall<P, Q, B, R>): HookedApiCall<P, Q, B, R> {
    const profile = useProfile();
    return useCallback(
        (...args: ApiCallData<P, Q, B>) => call(profile.instance, ...args, profile.token),
        [profile, call],
    );
}

function parseResponse<T>(response: ApiResponse<T>): ApiResult<T> {
    if (isCaptchaRequiredResponse(response)) {
        return Result.Err({
            code: 0,
            message: 'Captcha Required',
            errors: [],
            body: response.body,
        });
    }

    if (isErrorResponse(response)) {
        // const API_ERROR_LOG_CHANNEL = 'API_ERROR_LOG_CHANNEL';
        // Lumber.createChannel(API_ERROR_LOG_CHANNEL, 3);
        // logApiError(response.body);
        // console.error(response.body);
        return Result.Err(formatAPIErrorResponse(response.body));
    }

    // TS seems to struggle with discrimination. Get more racist ffs
    return Result.Ok(response.body as T);
}

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
