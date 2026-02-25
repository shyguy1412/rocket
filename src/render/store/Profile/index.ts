import { getGatewaySocket } from '@/render/lib/socket';
import { InstanceStore } from '@/render/store/Instance';
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

const openGateways = (profiles: Profile[]) => {
    for (const profile of profiles ?? []) {
        const gatewayUrl = InstanceStore.get().context.instances?.find((i) =>
            i.api.baseUrl == profile.instance
        );
        if (!gatewayUrl) {
            continue;
        }
        const socket = getGatewaySocket(gatewayUrl.gateway.baseUrl, profile.token);
        //add service to do things
    }
};
ProfileStore.subscribe((state) => {
    openGateways(state.context.profiles ?? []);
});
openGateways(ProfileStore.get().context.profiles ?? []);

export const useProfiles = () => {
    const empty = useMemo(() => [], []);
    const state = useSelector(ProfileStore, (state) => state.context.profiles) ?? empty;
    return state;
};

export const useProfile = () => useContext(ProfileContext);
