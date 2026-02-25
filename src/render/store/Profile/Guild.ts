import { useApi } from '@/api';
import { getChannels } from '@/api/guilds/#guild_id/channels';
import { getGuilds } from '@/api/users/@me/guilds';
import { useGateway } from '@/render/lib/socket';
import { useInstance } from '@/render/store/Instance';
import { APIChannelArray, APIGuild, APIMessageArray } from '@/schemas/index';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store-react';
import { useCallback, useEffect, useMemo } from 'preact/hooks';

type GuildStoreContext = {
    guilds: {
        [instance: string]: Guild[];
    };
};

export type Guild = {
    guild: APIGuild;
    channels: Channel[];
};

export type Channel = {
    channel: APIChannelArray[number];
};

type SetGuildChannelsAction = {
    instance: string;
    guildID: string;
    channels: APIChannelArray;
};

export const GuildStore = createStore({
    context: JSON.parse(
        localStorage.getItem('guild-store') ?? '{}',
    ) as Partial<GuildStoreContext>,
    on: {
        addGuilds(context, action: { instance: string; guilds: Guild[] }) {
            context.guilds ??= {};
            context.guilds[action.instance] = action.guilds;
            return { guilds: context.guilds };
        },
        setGuildChannels(context, action: SetGuildChannelsAction) {
            const guild = context.guilds?.[action.instance].find((g) =>
                g.guild.id == action.guildID
            );

            if (!guild) {
                return context;
            }
            guild.channels = action.channels.map((c) => ({
                channel: c,
            }));
            return { guilds: context.guilds };
        },
    },
});

GuildStore.subscribe(() => {
    const ctx = GuildStore.getSnapshot().context;
    localStorage.setItem('guild-store', JSON.stringify(ctx));
});

export const useGuilds = () => {
    const empty = useMemo(() => [], []);
    const instance = useInstance().api.baseUrl;
    const getProfileGuilds = useApi(getGuilds);

    const guilds = useSelector(
        GuildStore,
        (state) => state.context.guilds?.[instance],
    ) ?? empty;

    useEffect(() => {
        if (guilds != empty) {
            return;
        }
        getProfileGuilds().then((result) =>
            result
                .map((guilds) => guilds.map((guild) => ({ guild, channels: [] })))
                .map((guilds) => GuildStore.trigger.addGuilds({ instance, guilds }))
        );
    }, [guilds, instance]);

    return guilds;
};

export const useChannel = (channelID: string) => {
    const guilds = useGuilds();

    const channel = useMemo(
        () =>
            guilds.reduce(
                (prev, guild) =>
                    prev ?? guild.channels.find((c) => c.channel.id == channelID),
                undefined as undefined | Channel,
            ),
        [guilds, channelID],
    );

    return channel;
};

const CacheMap: Record<string, boolean> = {};

export const useChannels = (guildID: string) => {
    const empty = useMemo(() => [], []);
    const instance = useInstance().api.baseUrl;
    const getProfileChannels = useApi(getChannels);
    const gateway = useGateway();

    const updateChannels = useCallback(
        () =>
            getProfileChannels(guildID).then((result) =>
                result.map((channels) =>
                    GuildStore.trigger.setGuildChannels({
                        instance,
                        guildID,
                        channels,
                    })
                )
            ),
        [guildID],
    );

    const channels = useSelector(
        GuildStore,
        (state) =>
            state.context.guilds?.[instance].find((g) => g.guild.id == guildID)?.channels,
    ) ?? empty;

    useEffect(() => {
        if (guildID in CacheMap) {
            return;
        }
        CacheMap[guildID] = true;

        const controller = new AbortController();

        updateChannels();

        return controller.abort();
    }, [guildID, ...channels, gateway, updateChannels]);

    return channels;
};
