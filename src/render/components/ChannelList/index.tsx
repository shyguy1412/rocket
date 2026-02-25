import style from './ChannelList.module.css';

import { h } from 'preact';
import { memo, useCallback, useMemo } from 'preact/compat';

import { Lumber } from '@/lib/log/Lumber';
import { ChannelRouter } from '@/render/views/Guild';
import { Channel, useChannels, useGuilds } from '@/render/store/Profile/Guild';

export namespace ChannelList {
    export type Props = {
        guildID: string;
    };
}

const formatChannels = (channels: Channel[]) => {
    const categories = channels.filter((c) => c.channel.parent_id == null);
    return categories.map(
        (c) => [c, ...channels.filter((cc) => c.channel.id == cc.channel.parent_id)],
    );
};

const navigateToChannel = ({ channel }: Channel) => {
    const NAVIGATEABLE = [
        0, //Test channel
        1, //DM
        5, //News channel
    ];
    if (!NAVIGATEABLE.includes(channel.type)) {
        console.error(
            'Can not navigate to channel, unsupported type: ' + channel.type,
        );
        return;
    }
    ChannelRouter.trigger.setRoute({ route: channel.id });
};

const _ChannelList = ({ guildID }: ChannelList.Props) => {
    Lumber.log(Lumber.RENDER, 'CHANNEL LIST RENDER');

    const channels = useChannels(guildID);
    const guildName = useGuilds().find((g) => g.guild.id == guildID)?.guild.name;
    const categories = useMemo(() => formatChannels(channels), [channels]);

    return <div class={style.channellist}>
        {guildName}
        {categories.map((c, i) => <ChannelGroup key={i} group={c} />)}
    </div>;
};

export const ChannelList = memo(_ChannelList);

namespace ChannelGroup {
    export type Props = {
        group: Channel[];
    };
}
const _ChannelGroup = (props: ChannelGroup.Props) => {
    const [category, ...channels] = props.group;

    return <details open>
        <summary>{category.channel.name}</summary>
        <ul>
            {channels.map((c, i) =>
                <li
                    key={i}
                    onClick={useCallback(navigateToChannel.bind(undefined, c), [c])}
                >
                    {c.channel.name}
                </li>
            )}
        </ul>
    </details>;
};
const ChannelGroup = memo(_ChannelGroup);
