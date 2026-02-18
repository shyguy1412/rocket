import { ApiCall, buildApiCall } from "@/api";
import { TokenOnlyResponse } from "@/schemas/responses";
import { RegisterSchema } from "@/schemas/uncategorised";
import route from "meta:api(./src/api)";

export const register = buildApiCall({
    route,
    method: "POST",
    chaptchaRequired(response) {
    },
}) satisfies ApiCall<RegisterSchema, TokenOnlyResponse>;
