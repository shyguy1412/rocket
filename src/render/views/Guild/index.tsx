import { Fragment, h } from 'preact';
import { memo, useEffect } from 'preact/compat';

import { GuildRouter } from '@/render/views/Home';
import { Lumber } from '@/lib/log/Lumber';
import { ChannelList } from '@/render/components/ChannelList';
import { createRouter, RouteTable, useRoute, useView, View } from '@/lib/Router';
import { Channel } from '@/render/views/Channel';
import { useGuilds } from '@/render/store/Guild';

export namespace Guild {
    export type Props = {};
}

export const ChannelRouter = createRouter<RouteTable<string, View<{}>>>(
    { '': () => <div>NONE</div> },
    JSON.parse(localStorage.getItem('channel-router') ?? '""'),
    Channel,
);

ChannelRouter.subscribe(() => {
    const route = ChannelRouter.getSnapshot().context.route;
    localStorage.setItem('channel-router', JSON.stringify(route));
});

const _Guild = ({}: Guild.Props) => {
    Lumber.log(Lumber.RENDER, 'GUILD RENDER');

    const Channel = useView(ChannelRouter);

    return <>
        <ChannelList></ChannelList>
        <Channel></Channel>
    </>;
};
export const Guild = memo(_Guild);
