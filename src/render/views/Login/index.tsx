import style from './Login.module.css';

import { Fragment, h } from 'preact';
import { memo, useEffect, useMemo, useState } from 'preact/compat';

import { LoginForm } from '@/render/views/Login/LoginForm';
import { createRouter, useView } from '@/lib/Router';
import { RegisterForm } from '@/render/views/Login/RegisterForm';
import { useApi } from '@/api';
import { FormController } from '@/render/views/Login/FormController';
import { register } from '@/api/auth/register';
import { login } from '@/api/auth/login';
import { getMe } from '@/api/users/@me';
import {
    Profile,
    ProfileContext,
    ProfileStore,
    useProfile,
    useProfiles,
} from '@/render/store/Profile';
import { useModal } from '@/lib/components/Modal';
import { LoginResponse, LoginSchema, RegisterSchema } from '@/schemas/uncategorised';
import { TokenOnlyResponse } from '@/schemas/index';
import { UserBadge } from '@/render/components/UserBadge';
import { MoonLoader } from 'react-spinners';
import { usePromise } from '@/lib/hooks/useAsync';
import { IoCheckmark, IoClose } from 'react-icons/io5';

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

    const profile = (await getMe(instance, token)).unwrap();

    ProfileStore.trigger.addProfile({
        instance,
        token,
        user: profile,
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
    const profiles = useProfiles();

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
    (props: { profiles: Profile[] }) => {
        const AddProfileModal = useModal(() => <FormView></FormView>);
        const [successCount, setCount] = useState(0);

        return <>
            {props.profiles.map((p, i) =>
                <ProfileContext.Provider value={p}>
                    <Profile
                        accept={() => setCount((c) => c + 1)}
                        reject={() => []}
                        key={i}
                    >
                    </Profile>
                </ProfileContext.Provider>
            )}
            <button
                onClick={() => AddProfileModal.open({})}
            >
                Add Profile
            </button>
            <button
                disabled={successCount < props.profiles.length}
            >
                Continue
            </button>
        </>;
    },
);

namespace Profile {
    export type Props = {
        accept: () => void;
        reject: () => void;
    };
}

const Profile = memo(
    ({ accept, reject }: Profile.Props) => {
        const profile = useProfile();
        const getMeHookThingy = useApi(getMe);
        const validate = usePromise(getMeHookThingy);

        const status = validate.resolved ?
            validate.value.isOk() ? <IoCheckmark></IoCheckmark> : <IoClose></IoClose> :
            <MoonLoader color='var(--clr-primary-a0)'></MoonLoader>;

        useEffect(() => {
            if (!validate.resolved) {
                return;
            }
            if (validate.value.isOk()) {
                accept();
            } else {
                reject();
            }
        }, [validate.resolved, accept, reject]);

        return <div class={style.profile}>
            <UserBadge user={profile.user}></UserBadge>
            {status}
        </div>;
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
