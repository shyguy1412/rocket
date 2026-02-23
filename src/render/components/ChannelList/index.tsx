import style from './ChannelList.module.css';

import { h } from 'preact';
import { memo } from 'preact/compat';

import { Lumber } from '@/lib/log/Lumber';
import { useRoute, useRouter } from '@/lib/Router';
import { GuildRouter } from '@/render/views/Home';
import { ChannelRouter } from '@/render/views/Guild';
import { useChannels, useGuilds } from '@/render/store/Profile/Guild';

export namespace ChannelList {
    export type Props = {
        guildID: string;
    };
}

const _ChannelList = ({ guildID }: ChannelList.Props) => {
    Lumber.log(Lumber.RENDER, 'CHANNEL LIST RENDER');
    const guildName = useGuilds().find((g) => g.guild.id == guildID)?.guild.name;
    const channels = useChannels(guildID);
    const { setRoute } = useRouter(ChannelRouter);

    return <div class={style.channellist}>
        {guildName}
        {
            <ul>
                {channels.map((c, i) =>
                    <li
                        onClick={() => setRoute(c.channel.id)}
                        key={i}
                    >
                        {c.channel.name}
                    </li>
                )}
            </ul>
        }
    </div>;
};

export const ChannelList = memo(_ChannelList);
