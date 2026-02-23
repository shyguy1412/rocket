import { useProfile } from '@/render/store/Profile';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store-react';
import { useContext } from 'preact/hooks';

export type Instance = {
    api: {
        baseUrl: string;
        apiVersions: {
            default: string;
            active: string[];
        };
    };
    cdn: {
        baseUrl: string;
    };
    gateway: {
        baseUrl: string;
        encoding: string[];
        compression: string[];
    };
    admin: {
        baseUrl: string;
    };
};

type InstanceStoreContext = {
    instances: Instance[];
};

export const InstanceStore = createStore({
    context: JSON.parse(
        localStorage.getItem('instance-store') ?? '{}',
    ) as Partial<InstanceStoreContext>,
    on: {
        addInstance(context, { instance }: { instance: Instance }) {
            context.instances ??= [];

            const instanceExists = context.instances.some((existing) =>
                existing.api.baseUrl == instance.api.baseUrl
            );

            if (instanceExists) {
                return context;
            }

            context.instances.push(instance);
            return { instances: context.instances };
        },
    },
});

InstanceStore.subscribe(() => {
    const ctx = InstanceStore.getSnapshot().context;
    localStorage.setItem('instance-store', JSON.stringify(ctx));
});

export const useInstances = () => {
    return useSelector(InstanceStore, (state) => state.context.instances) ?? [];
};

export const useInstance = () => {
    const profile = useProfile();
    const instance = useSelector(
        InstanceStore,
        (state) =>
            state.context.instances?.find((i) => i.api.baseUrl == profile.instance),
    );
    if (!instance) {
        throw new Error('Could not get instance');
    }

    return instance;
};

// export const useTokenMap = () => {
//     return useSelector(ProfileStore, (state) => state.context.tokens);
// };
