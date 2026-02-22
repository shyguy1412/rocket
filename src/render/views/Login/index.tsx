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
import { getMe } from '@/api/users/@me';
import { LoadingScreen } from '@/render/components/LoadingScreen';
import { Lumber } from '@/lib/log/Lumber';
import { ProfileStore, useProfiles } from '@/render/store/Profile';
import { createModal, Modal, useModal } from '@/lib/components/Modal';
import { PrivateUser } from '@/schemas/api';
import { LoginResponse, LoginSchema, RegisterSchema } from '@/schemas/uncategorised';
import { TokenOnlyResponse, TokenResponse } from '@/schemas/index';

namespace Login {
    export type Props = {};
}

const API_SERVER = [
    'https://rory.server.spacebar.chat/api/v9',
    'https://api.yaoi.chat/api/v9',
];

const onSuccess = async (instance: string, { token }: { token: string | null }) => {
    if (token == null) {
        throw new Error('Not yet implemented');
    }

    const profile = (await getMe(instance, undefined, token)).unwrap();

    ProfileStore.trigger.addProfile({
        instance,
        token,
        profile,
    });

    // AppRouter.trigger.setRoute({ route: 'home' });
};

const useProfilesAsArray = () => {
    const profiles = useProfiles();
    const instances = Object.entries(profiles ?? {});
    const profileArray = instances.flatMap(([instance, profile]) =>
        Object.entries(profile ?? {}).map(([token, profile]) =>
            [instance, token, profile] as const
        )
    );

    return profileArray;
};

export const LoginRouter = createRouter({
    login: () =>
        <FormController<LoginSchema, LoginResponse>
            apiCall={login}
            Form={LoginForm}
            onSuccess={onSuccess}
        >
        </FormController>,
    register: () =>
        <FormController<RegisterSchema, TokenOnlyResponse>
            apiCall={register}
            Form={RegisterForm}
            onSuccess={onSuccess}
        >
        </FormController>,
}, 'login');

export const Login = memo(({}: Login.Props) => {
    const profiles = useProfilesAsArray();

    if (profiles.length > 0) {
        return <ProfileLoader profiles={profiles}></ProfileLoader>;
    }

    return <FormView></FormView>;
});

const FormView = memo(
    () => {
        const Form = useView(LoginRouter);
        return <Form></Form>;
    },
);

const ProfileLoader = memo(
    (props: { profiles: (readonly [string, string, PrivateUser])[] }) => {
        return props.profiles.map((p, i) => <Profile key={i} profile={p}></Profile>);
    },
);

const Profile = memo(
    (props: { profile: readonly [string, string, PrivateUser] }) => {
        const [instance, token, profile] = props.profile;

        console.log({ token });

        return <div>{profile.username}</div>;
    },
);

// const token = useToken(instance);

// const LoginRouter = useMemo(() =>
//     createRouter({
//         login: () =>
//             <FormController
//                 setRoute={(route: string) =>
//                     LoginRouter.trigger.setRoute({
//                         route: route as any, //idgaf
//                     })}
//                 apiCall={login}
//                 Form={LoginForm}
//                 onSuccess={onSuccess}
//             />,
//         register: () =>
//             <FormController
//                 setRoute={(route: string) =>
//                     LoginRouter.trigger.setRoute({
//                         route: route as any, //idgaf
//                     })}
//                 apiCall={login}
//                 Form={RegisterForm}
//                 onSuccess={onSuccess}
//             />,
//     }, 'login'), []);

// const tryLogin = usePromise(
//     useMemo(() => getMe.bind(undefined, instance), [instance]),
// );

// const View = useView(LoginRouter);

// Lumber.log(Lumber.RENDER, 'LOGIN RENDER');

// const notLoggedIn = ((localStorage.getItem('token') ?? '') == '') ||
//     (tryLogin.resolved && tryLogin.value.isError());

// if (notLoggedIn) {
//     return <View />;
// }

// if (tryLogin.resolved && tryLogin.value.isOk()) {
//     SettingsStore.trigger.set(tryLogin.value.value);
//     setRoute('home');
// }

// return <LoadingScreen />;
