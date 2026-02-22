import { PrivateUser } from '@/schemas/api';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store-react';

type ProfileStoreContext = {
    profiles: {
        [instance: string]: {
            [token: string]: PrivateUser;
        };
    };
};

type AddProfileAction = {
    instance: string;
    token: string;
    profile: PrivateUser;
};

export const ProfileStore = createStore({
    context: JSON.parse(
        localStorage.getItem('profile-store') ?? '{}',
    ) as Partial<ProfileStoreContext>,
    on: {
        addProfile(context, action: AddProfileAction) {
            context.profiles ??= {};
            context.profiles[action.instance] ??= {};
            context.profiles[action.instance][action.token] = action.profile;
            return { profiles: context.profiles };
        },
    },
});

ProfileStore.subscribe(() => {
    const ctx = ProfileStore.getSnapshot().context;
    localStorage.setItem('profile-store', JSON.stringify(ctx));
});

export const useProfiles = () => {
    return useSelector(ProfileStore, (state) => state.context.profiles) ?? {};
};

// export const useTokenMap = () => {
//     return useSelector(ProfileStore, (state) => state.context.tokens);
// };
