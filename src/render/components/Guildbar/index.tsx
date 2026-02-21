import style from './Guildbar.module.css';

import { h } from 'preact';
import { memo } from 'preact/compat';

import { useGuilds } from '@/render/store/Guild';
import { useRouter } from '@/lib/Router';
import { GuildRouter } from '@/render/views/Home';
import { Lumber } from '@/lib/log/Lumber';

export namespace Guildbar {
    export type Props = {};
}

const _Guildbar = ({}: Guildbar.Props) => {
    const { setRoute } = useRouter(GuildRouter);
    const guilds = useGuilds();

    Lumber.log(Lumber.RENDER, 'GUILDBAR RENDER');

    return <ul class={style.guildbar}>
        {[{ id: 'DM', name: 'DM' }, ...guilds].map((guild, key) =>
            <li
                key={key}
                onClick={() => setRoute(guild.id)}
            >
                {guild.name}
            </li>
        )}
    </ul>;
};
export const Guildbar = memo(_Guildbar);
