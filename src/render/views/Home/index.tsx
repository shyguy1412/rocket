import style from './Home.module.css';
import { h } from 'preact';
import { memo } from 'preact/compat';
import { Guildbar } from '@/render/components/Guildbar';
import { createRouter, RouteTable, useView, View } from '@/lib/Router';
import { Guild } from '@/render/views/Guild';
import { Lumber } from '@/lib/log/Lumber';
import { InstanceContext } from '@/render/hooks/useInstance';

export namespace Home {
    export type Props = {};
}

export const GuildRouter = createRouter<RouteTable<string, View<Guild.Props>>>(
    {
        DM: () => <div>DM</div>,
    },
    JSON.parse(localStorage.getItem('guild-router') ?? '""') || 'DM',
    Guild,
);

GuildRouter.subscribe(() => {
    const route = GuildRouter.getSnapshot().context.route;
    localStorage.setItem('guild-router', JSON.stringify(route));
});

const _Home = ({}: Home.Props) => {
    Lumber.log(Lumber.RENDER, 'HOME RENDER');

    const View = useView(GuildRouter);

    return <div class={style.home}>
        <InstanceContext.Provider value='foo'>
            <Guildbar></Guildbar>
            <View></View>
        </InstanceContext.Provider>
    </div>;
};

export const Home = memo(_Home);
