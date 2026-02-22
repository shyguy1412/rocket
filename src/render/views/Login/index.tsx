import { Fragment, h } from 'preact';
import { memo, useMemo, useState } from 'preact/compat';

import { LoginForm } from '@/render/views/Login/LoginForm';
import { createRouter, Route, useRouter, useView } from '@/lib/Router';
import { RegisterForm } from '@/render/views/Login/RegisterForm';
import { ApiCall } from '@/api';
import { FormController } from '@/render/views/Login/FormController';
import { register } from '@/api/auth/register';
import { login } from '@/api/auth/login';
import { AppRouter } from '@/render/components/App';
import { usePromise } from '@/lib/hooks';
import { get_me } from '@/api/users/@me';
import { LoadingScreen } from '@/render/components/LoadingScreen';
import { SettingsStore } from '@/render/store/Settings';
import { Lumber } from '@/lib/log/Lumber';

namespace Login {
    export type Props = {};
}

const onSuccess = (response: { token: string | null }) => {
    if (response.token == null) {
        throw new Error('Not yet implemented');
    }

    localStorage.setItem('token', response.token);

    AppRouter.trigger.setRoute({ route: 'home' });
};

export const Login = memo(({}: Login.Props) => {
    const { setRoute } = useRouter(AppRouter);

    const LoginRouter = useMemo(() =>
        createRouter({
            login: () =>
                <FormController
                    setRoute={(route: string) =>
                        LoginRouter.trigger.setRoute({
                            route: route as any, //idgaf
                        })}
                    apiCall={login}
                    Form={LoginForm}
                    onSuccess={onSuccess}
                />,
            register: () =>
                <FormController
                    setRoute={(route: string) =>
                        LoginRouter.trigger.setRoute({
                            route: route as any, //idgaf
                        })}
                    apiCall={login}
                    Form={RegisterForm}
                    onSuccess={onSuccess}
                />,
        }, 'login'), []);
    const tryLogin = usePromise(get_me);

    const View = useView(LoginRouter);

    Lumber.log(Lumber.RENDER, 'LOGIN RENDER');

    const notLoggedIn = ((localStorage.getItem('token') ?? '') == '') ||
        (tryLogin.resolved && tryLogin.value.isError());

    if (notLoggedIn) {
        return <View />;
    }

    if (tryLogin.resolved && tryLogin.value.isOk()) {
        SettingsStore.trigger.set(tryLogin.value.value);
        setRoute('home');
    }

    return <LoadingScreen />;
});
