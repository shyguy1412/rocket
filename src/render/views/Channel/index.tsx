import { h } from 'preact';
import { memo, useCallback, useContext, useEffect, useState } from 'preact/compat';

import { useRoute } from '@/lib/Router';
import { ChannelRouter } from '@/render/views/Guild';
import { Lumber } from '@/lib/log/Lumber';
import { usePromise } from '@/lib/hooks';
import { preloadMessages } from '@/api/channels/preload-messages';
import { LoadingScreen } from '@/render/components/LoadingScreen';
import { useChannels } from '@/render/store/Channel';
import { GuildRouter, SocketContext } from '@/render/views/Home';
import { getChannel } from '@/api/channels/#channel_id';
import { getMessages, sendMessage } from '@/api/channels/#channel_id/messages';
import { APIMessageArray } from '@/schemas/responses';

export namespace Channel {
    export type Props = {};
}
const _Channel = ({}: Channel.Props) => {
    const guildID = useRoute(GuildRouter).at(-1)!;
    const channelID = useRoute(ChannelRouter).at(-1)!;
    const channel = useChannels(guildID).find((channel) => channel.id == channelID);
    const [messages, setMessages] = useState([] as APIMessageArray);
    const socket = useContext(SocketContext);

    const getChannelMessages = useCallback(
        () => getMessages(channelID),
        [channelID],
    );

    Lumber.log(Lumber.RENDER, 'CHANNEL RENDER');

    useEffect(() => {
        getChannelMessages()
            .then((response) => response.unwrap())
            .then((messages) => setMessages(messages.toReversed()))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (socket.isError()) {
            return;
        }

        const controller = new AbortController();

        socket.value.addEventListener('message', (ev) => {
            const payload = JSON.parse(ev.data);
            if (payload.t == 'MESSAGE_CREATE' && payload.d.channel_id == channelID) {
                setMessages((messages) => {
                    return [...messages, payload.d];
                });
            }

            if (payload.t == 'MESSAGE_UPDATE') {
                console.log('UPDATE NOT YET IMPLEMENTED');

                // setMessages((messages) => {
                //     return [...messages, payload.d];
                // });
            }
        });

        return () => controller.abort();
    }, [socket]);

    return <div>
        {channelID}
        <ul>
            {messages.map((m) =>
                <li>
                    {m.author?.username}#{m.author?.discriminator}: {m.content}
                </li>
            )}
        </ul>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                console.log(e.currentTarget.children[0].value);
                sendMessage(channelID, {
                    content: e.currentTarget.children[0].value,
                });

                e.currentTarget.children[0].value = '';
            }}
        >
            <input type='text' />
            <input type='submit' hidden />
        </form>
    </div>;
};
export const Channel = memo(_Channel);
