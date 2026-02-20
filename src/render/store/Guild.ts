import { getGuilds } from '@/api/users/@me/guilds';
import { AsyncState, usePromise } from '@/lib/hooks';
import { APIGuildArray } from '@/schemas/responses';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store-react';
import { useEffect, useMemo } from 'preact/hooks';

export const GuildStore = createStore({
    context: { guilds: undefined as APIGuildArray | undefined },
    on: {
        setGuilds: (context, { guilds }: { guilds: APIGuildArray }) => {
            return { guilds };
        },
    },
});

export const useGuilds = () => {
    const empty = useMemo(() => [], []);

    const guilds = useSelector(
        GuildStore,
        (state) => state.context.guilds,
    ) ?? empty;

    useEffect(() => {
        if (guilds != empty) {
            return;
        }

        getGuilds().then((result) =>
            result.map((guilds) => GuildStore.trigger.setGuilds({ guilds }))
        );
    }, guilds);

    return guilds;
};
