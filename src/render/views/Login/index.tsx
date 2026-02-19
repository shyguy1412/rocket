import { Fragment, h } from 'preact';
import { memo, useMemo, useState } from 'preact/compat';

import { LoginForm } from '@/render/views/Login/LoginForm';
import { createRouter, useRouter, useView } from '@/lib/Router';
import { RegisterForm } from '@/render/views/Login/RegisterForm';
import { ApiCall } from '@/api';
import { FormController } from '@/render/views/Login/FormController';
import { register } from '@/api/auth/register';
import { login } from '@/api/auth/login';
import { AppRouter } from '@/render/components/App';
import { useAsync, usePromise } from '@/lib/hooks';
import { get_me } from '@/api/users/@me';
import { LoadingScreen } from '@/render/components/LoadingScreen';
import { SettingsStore } from '@/render/store/Settings';
import { Lumber } from '@/lib/log/Lumber';

namespace Login {
    export type Props = {};
}

const createForm =
    <B, R>(apiCall: ApiCall<B, R>, form: FormController.Form) =>
    (props: { router: any; onSuccess: (response: R) => void }) => (
        <FormController<B, R>
            router={props.router}
            apiCall={apiCall}
            Form={form}
            onSuccess={props.onSuccess}
        />
    );

const createLoginRouter = () =>
    createRouter({
        login: createForm(login, LoginForm),
        register: createForm(register, RegisterForm),
    }, 'login');

export type LoginRouter = ReturnType<typeof createLoginRouter>;

export const Login = memo(({}: Login.Props) => {
    const { setRoute } = useRouter(AppRouter);

    const LoginRouter = useMemo(createLoginRouter, []);
    const tryLogin = usePromise(get_me);

    const View = useView(LoginRouter);

    Lumber.log(Lumber.RENDER, 'LOGIN RENDER');

    const onSuccess = (response: { token: string | null }) => {
        if (response.token == null) {
            throw new Error('Not yet implemented');
        }

        localStorage.setItem('token', response.token);

        setRoute('home');
    };

    const notLoggedIn = ((localStorage.getItem('token') ?? '') == '') ||
        (tryLogin.resolved && tryLogin.value.isError());

    if (notLoggedIn) {
        return <View router={LoginRouter} onSuccess={onSuccess} />;
    }

    if (tryLogin.resolved && tryLogin.value.isOk()) {
        SettingsStore.trigger.set(tryLogin.value.value);
        setRoute('home');
    }

    return <LoadingScreen />;
});
