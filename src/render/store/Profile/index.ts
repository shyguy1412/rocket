import { initializeProfile } from '@/render/lib/init';
import { getGatewaySocket } from '@/render/lib/socket';
import { InstanceStore } from '@/render/store/Instance';
import { MessageStore } from '@/render/store/Profile/Message';
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

ProfileStore.subscribe((state) => {
    localStorage.setItem('profile-store', JSON.stringify(state.context));
});

ProfileStore.subscribe((state) => {
    //! handle this more nicely
    window.location.reload();
    // openGateways(state.context.profiles ?? []);
});

export const useProfiles = () => {
    const empty = useMemo(() => [], []);
    const state = useSelector(ProfileStore, (state) => state.context.profiles) ?? empty;
    return state;
};

export const useProfile = () => {
    const profile = useContext(ProfileContext);
    initializeProfile(profile);
    return profile;
};
