import { useConstant } from '@/lib/hooks';
import { PrivateUser } from '@/schemas/api';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store-react';
import { createContext } from 'preact';
import { useContext, useMemo } from 'preact/hooks';

type ProfileStoreContext = {
    profiles: Profile[];
};

export type Profile = {
    instance: string;
    token: string;
    user: PrivateUser;
};

export const ProfileContext = createContext(null as unknown as Profile);

export const ProfileStore = createStore({
    context: JSON.parse(
        localStorage.getItem('profile-store') ?? '{}',
    ) as Partial<ProfileStoreContext>,
    on: {
        addProfile(context, action: Profile) {
            return { profiles: [...context.profiles ?? [], action] };
        },
    },
});

ProfileStore.subscribe(() => {
    const ctx = ProfileStore.getSnapshot().context;
    localStorage.setItem('profile-store', JSON.stringify(ctx));
});

export const useProfiles = () => {
    const empty = useMemo(() => [], []);
    const state = useSelector(ProfileStore, (state) => state.context.profiles) ?? empty;
    return state;
};

export const useProfile = () => useContext(ProfileContext);

// export const useTokenMap = () => {
//     return useSelector(ProfileStore, (state) => state.context.tokens);
// };
