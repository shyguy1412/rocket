import style from './Guildbar.module.css';

import { h } from 'preact';
import { memo, useEffect } from 'preact/compat';

import { GuildStore, useGuilds } from '@/render/store/Guild';
import { LoadingScreen } from '@/render/components/LoadingScreen';
import { APIGuildArray } from '@/schemas/responses';
import { useRouter } from '@/lib/Router';
import { GuildRouter } from '@/render/views/Home';

export namespace Guildbar {
    export type Props = {
        guilds: APIGuildArray;
    };
}

const GuildbarComponent = ({ guilds }: Guildbar.Props) => {
    const { setRoute } = useRouter(GuildRouter);

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
export const Guildbar = memo(GuildbarComponent);
