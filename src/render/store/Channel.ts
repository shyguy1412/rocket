import { getChannel } from '@/api/guilds/#guild_id/channels';
import { APIChannelArray } from '@/schemas/responses';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store-react';
import { useEffect, useMemo } from 'preact/hooks';

export const ChannelStore = createStore({
    context: { channels: {} as { [guild: string]: APIChannelArray } },
    on: {
        setGuildChannels: (
            context,
            { guildID, channels }: { guildID: string; channels: APIChannelArray },
        ) => {
            if (guildID in context.channels) {
                return;
            }
            return { channels: { ...context.channels, [guildID]: channels } };
        },
        updateGuildChannels: (
            context,
            { guildID, channels }: { guildID: string; channels: APIChannelArray },
        ) => {
            return { channels: { ...context.channels, [guildID]: channels } };
        },
    },
});

export const useChannels = (guildID: string) => {
    const empty = useMemo(() => [], []);

    const channels = useSelector(
        ChannelStore,
        (state) => state.context.channels[guildID],
    ) ?? empty;

    useEffect(() => {
        if (channels != empty) {
            return;
        }

        getChannel(guildID).then((result) =>
            result.map((channels) =>
                ChannelStore.trigger.setGuildChannels({ guildID, channels })
            )
        );
    }, channels);

    return channels;
};
