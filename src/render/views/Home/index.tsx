import { useAsync } from '@/lib/hooks';
import style from './Home.module.css';
import { h } from 'preact';
import { memo, useEffect, useMemo, useState } from 'preact/compat';
import { get_me } from '@/api/users/@me';
import { get_guilds } from '@/api/users/@me/guilds';
import { Guildbar } from '@/render/components/Guildbar';
import { GuildStore, useGuilds } from '@/render/store/Guild';
import { createRouter, RouteTable, useView, View } from '@/lib/Router';
import { LoadingScreen } from '@/render/components/LoadingScreen';
import { Guild } from '@/render/views/Guild';

export namespace Home {
    export type Props = {};
}

export const GuildRouter = createRouter<RouteTable<string, View<{}>>>(
    {
        DM: () => <div>DM</div>,
    },
    'DM',
    Guild,
);

const HomeComponent = ({}: Home.Props) => {
    const guilds = useGuilds();

    const View = useView(GuildRouter);

    if (!guilds.resolved) {
        return <LoadingScreen></LoadingScreen>;
    }

    return <div>
        <Guildbar guilds={guilds.value}></Guildbar>
        <View></View>
    </div>;
};

export const Home = memo(HomeComponent);
