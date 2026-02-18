import style from "./Login.module.css";
import { h } from "preact";
import { memo, useCallback } from "preact/compat";

import { login } from "@/api/auth/login";
import { register } from "@/api/auth/register";
import { Result } from "@/lib/types/Result";

namespace Login {
    export type Props = {};
}
export const Login = memo(({}: Login.Props) => {
    const onClick = useCallback(async () => {
        let result = await register({
            username: "shy",
            password: "password",
            consent: true,
            email: "test@mail.com",
            date_of_birth: new Date("2000-08-25"),
        });

        if (result.isOk()) {
            return console.log("VALUE: ", result.value);
        }
    }, []);

    return (
        <div>
            LOGIN!

            <button
                onClick={onClick}
            >
                LOGIN TEST!
            </button>
        </div>
    );
});
