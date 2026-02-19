import style from './Guild.module.css';

import { h } from 'preact';
import { memo } from 'preact/compat';

import { get_guilds } from '@/api/users/@me/guilds';
import { useAsync } from '@/lib/hooks';
import { LoadingScreen } from '@/render/components/LoadingScreen';
import { useRoute } from '@/lib/Router';
import { GuildRouter } from '@/render/views/Home';

export namespace Guild {
    export type Props = {};
}
const GuildComponent = ({}: Guild.Props) => {
    const guildID = useRoute(GuildRouter).at(-1)!;

    return <div>{guildID}</div>;
};
export const Guild = memo(GuildComponent);
