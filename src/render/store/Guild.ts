import { get_guilds } from '@/api/users/@me/guilds';
import { AsyncState, usePromise } from '@/lib/hooks';
import { APIGuildArray } from '@/schemas/responses';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store-react';
import { useEffect } from 'preact/hooks';

export const GuildStore = createStore({
    context: { guilds: new Promise(() => {}) as Promise<APIGuildArray> },
    on: {
        update: (context) => {
            let guilds = get_guilds()
                .then((result) => {
                    if (result.isError()) {
                        throw new Error('Unrecoverable failure: Getting Guilds');
                    }
                    return result.value;
                })
                .catch((e) => console.error(e))
                //prevent promise from evere resolving without guilds
                .then((r) => r ?? new Promise<APIGuildArray>(() => {}));

            return { guilds };
        },
    },
});

export const useGuilds = (): AsyncState<APIGuildArray> => {
    return usePromise(useSelector(GuildStore, (state) => state.context.guilds));
};
