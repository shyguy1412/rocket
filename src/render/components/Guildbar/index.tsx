import style from './Guildbar.module.css';

import { h } from 'preact';
import { memo, useEffect } from 'preact/compat';

import { GuildStore, useGuilds } from '@/render/store/Guild';
import { LoadingScreen } from '@/render/components/LoadingScreen';
import { APIGuildArray } from '@/schemas/responses';
import { useRouter } from '@/lib/Router';
import { GuildRouter } from '@/render/views/Home';
import { Lumber } from '@/lib/log/Lumber';

export namespace Guildbar {
    export type Props = {
        guilds: APIGuildArray;
    };
}

const _Guildbar = ({ guilds }: Guildbar.Props) => {
    const { setRoute } = useRouter(GuildRouter);

    Lumber.log(Lumber.RENDER, 'GUILDBAR RENDER');

    return <ul>
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
