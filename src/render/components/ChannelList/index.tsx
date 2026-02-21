import style from './ChannelList.module.css';

import { Fragment, h } from 'preact';
import { memo } from 'preact/compat';

import { Lumber } from '@/lib/log/Lumber';
import { useRoute, useRouter } from '@/lib/Router';
import { GuildRouter } from '@/render/views/Home';
import { useChannels } from '@/render/store/Channel';
import { useGuilds } from '@/render/store/Guild';
import { ChannelRouter } from '@/render/views/Guild';

export namespace ChannelList {
    export type Props = {};
}

const _ChannelList = ({}: ChannelList.Props) => {
    Lumber.log(Lumber.RENDER, 'CHANNEL LIST RENDER');
    const guildID = useRoute(GuildRouter).at(-1)!;
    const channels = useChannels(guildID);
    const guildName = useGuilds().find((g) => g.id == guildID)?.name ?? '';

    const { setRoute } = useRouter(ChannelRouter);

    return <div class={style.channellist}>
        {guildName}
        <ul>
            {channels.map((c, i) =>
                <li
                    onClick={() => setRoute(c.id)}
                    key={i}
                >
                    {c.name}
                </li>
            )}
        </ul>
    </div>;
};

export const ChannelList = memo(_ChannelList);
