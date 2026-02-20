import { getGuilds } from '@/api/users/@me/guilds';
import { AsyncState, usePromise } from '@/lib/hooks';
import { Result } from '@/lib/types/Result';
import { PrivateUser } from '@/schemas/api';
import { APIGuildArray } from '@/schemas/responses';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store-react';

export const SettingsStore = createStore({
    context: { settings: Result.Err(undefined) as Result<PrivateUser, undefined> },
    on: {
        set: (context, settings: PrivateUser) => {
            return { settings: Result.Ok<PrivateUser, undefined>(settings) };
        },
    },
});

export const useSettings = () => {
    return useSelector(SettingsStore, (state) => state.context.settings);
};
