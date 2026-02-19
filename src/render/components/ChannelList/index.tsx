import { useGuilds } from '@/render/store/Guild';
import style from './ChannelList.module.css';
import { h } from 'preact';
import { memo } from 'preact/compat';
import { Lumber } from '@/lib/log/Lumber';
import { useRoute, useRouter } from '@/lib/Router';
import { GuildRouter } from '@/render/views/Home';
import { useChannels } from '@/render/store/Channel';
import { ChannelRouter } from '@/render/views/Guild';

export namespace ChannelList {
    export type Props = {};
}

const _ChannelList = ({}: ChannelList.Props) => {
    Lumber.log(Lumber.RENDER, 'CHANNEL LIST RENDER');
    const guild = useRoute(GuildRouter).at(-1)!;
    const channels = useChannels(guild);

    const { setRoute } = useRouter(ChannelRouter);

    return <ul>
        {channels.map((c, i) =>
            <li
                onClick={() => setRoute(c.id)}
                key={i}
            >
                {c.name}
            </li>
        )}
    </ul>;
};

export const ChannelList = memo(_ChannelList);
