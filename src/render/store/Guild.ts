import { getGuilds } from '@/api/users/@me/guilds';
import { useInstance } from '@/render/hooks/useInstance';
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
    const instance = useInstance();

    const guilds = useSelector(
        GuildStore,
        (state) => state.context.guilds,
    ) ?? empty;

    useEffect(() => {
        if (guilds != empty) {
            return;
        }

        getGuilds(instance).then((result) =>
            result.map((guilds) => GuildStore.trigger.setGuilds({ guilds }))
        );
    }, guilds);

    return guilds;
};
