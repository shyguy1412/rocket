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
    '',
    Channel,
);

const _Guild = ({}: Guild.Props) => {
    const guildID = useRoute(GuildRouter).at(-1)!;
    const guildName = useGuilds().find((g) => g.id == guildID)?.name!;

    Lumber.log(Lumber.RENDER, 'GUILD RENDER');

    const Channel = useView(ChannelRouter);

    console.log({ Channel });

    return <>
        <div>
            {guildName}
            <ChannelList></ChannelList>
        </div>
        <Channel></Channel>
    </>;
};
export const Guild = memo(_Guild);
