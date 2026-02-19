import { useAsync, useConstant } from '@/lib/hooks';
import style from './Home.module.css';
import { createContext, h } from 'preact';
import { memo, useContext, useEffect, useMemo, useState } from 'preact/compat';
import { get_me } from '@/api/users/@me';
import { get_guilds } from '@/api/users/@me/guilds';
import { Guildbar } from '@/render/components/Guildbar';
import { GuildStore, useGuilds } from '@/render/store/Guild';
import { createRouter, RouteTable, useView, View } from '@/lib/Router';
import { LoadingScreen } from '@/render/components/LoadingScreen';
import { Guild } from '@/render/views/Guild';
import { Lumber } from '@/lib/log/Lumber';
import { openWebsocket } from '@/render/lib/socket';
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

    const guilds = useGuilds();
    const View = useView(GuildRouter);
    const [socket, setSocket] = useState<Result<WebSocket, undefined>>(
        Result.Err(undefined),
    );

    useEffect(() => {
        GuildStore.trigger.update();
        const socket = openWebsocket();
        const payload = {
            op: 2,
            d: {
                token: localStorage.getItem('token'),
            },
        } satisfies Payload;
        socket.then((s) => {
            s.send(JSON.stringify(payload));
            setSocket(Result.Ok(s));
        }).then();
    }, []);

    if (!guilds.resolved) {
        return <LoadingScreen></LoadingScreen>;
    }

    return <div class={style.home}>
        <Guildbar guilds={guilds.value}></Guildbar>
        <SocketContext.Provider value={socket}>
            <View></View>
        </SocketContext.Provider>
    </div>;
};

export const Home = memo(_Home);
