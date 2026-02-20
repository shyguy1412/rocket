import { useAsync, useConstant } from '@/lib/hooks';
import style from './Home.module.css';
import { createContext, h } from 'preact';
import { memo, useContext, useEffect, useMemo, useState } from 'preact/compat';
import { get_me } from '@/api/users/@me';
import { getGuilds } from '@/api/users/@me/guilds';
import { Guildbar } from '@/render/components/Guildbar';
import { GuildStore, useGuilds } from '@/render/store/Guild';
import { createRouter, RouteTable, useView, View } from '@/lib/Router';
import { LoadingScreen } from '@/render/components/LoadingScreen';
import { Guild } from '@/render/views/Guild';
import { Lumber } from '@/lib/log/Lumber';
import { GatewaySocket } from '@/render/lib/socket';
import { Payload } from 'spacebar_server/src/gateway';
import { Result } from '@/lib/types/Result';

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

export const SocketContext = createContext<Result<WebSocket, undefined>>(
    Result.Err(undefined),
);

const _Home = ({}: Home.Props) => {
    Lumber.log(Lumber.RENDER, 'HOME RENDER');

    const View = useView(GuildRouter);
    const [socket, setSocket] = useState<Result<WebSocket, undefined>>(
        Result.Err(undefined),
    );

    useEffect(() => {
        // GuildStore.trigger.update();
    }, []);

    return <div class={style.home}>
        <Guildbar></Guildbar>
        <SocketContext.Provider value={socket}>
            <View></View>
        </SocketContext.Provider>
    </div>;
};

export const Home = memo(_Home);
