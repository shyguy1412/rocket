import { getChannel } from '@/api/guilds/#guild_id/channels';
import { useInstance } from '@/render/hooks/useInstance';
import { APIChannelArray } from '@/schemas/responses';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store-react';
import { useEffect, useMemo } from 'preact/hooks';

type ChannelsUpdate = {
    server: string;
    guildID: string;
    channels: APIChannelArray;
};

export const ChannelStore = createStore({
    context: {
        channels: {} as { [server: string]: { [guild: string]: APIChannelArray } },
    },
    on: {
        setGuildChannels: (context, update: ChannelsUpdate) => {
            const { guildID, channels, server } = update;
            if (guildID in context.channels) {
                return;
            }
            context.channels[server][guildID] = channels;
            return { channels: { ...context.channels } };
        },
        updateGuildChannels: (context, update: ChannelsUpdate) => {
            const { guildID, channels, server } = update;
            context.channels[server][guildID] = channels;
            return { channels: { ...context.channels } };
        },
    },
});

export const useChannels = (guildID: string) => {
    const empty = useMemo(() => [], []);

    const instance = useInstance();

    const channels = useSelector(
        ChannelStore,
        (state) => state.context.channels[instance][guildID],
    ) ?? empty;

    useEffect(() => {
        if (channels != empty) {
            return;
        }

        getChannel(instance, guildID).then((result) =>
            result.map((channels) =>
                ChannelStore.trigger.setGuildChannels({
                    server: instance,
                    guildID,
                    channels,
                })
            )
        );
    }, channels);

    return channels;
};
