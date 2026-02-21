import style from './Channel.module.css';

import { h } from 'preact';
import { memo, useCallback, useEffect, useState } from 'preact/compat';

import { useRoute } from '@/lib/Router';
import { ChannelRouter } from '@/render/views/Guild';
import { Lumber } from '@/lib/log/Lumber';
import { useChannels } from '@/render/store/Channel';
import { GuildRouter } from '@/render/views/Home';
import { getMessages, sendMessage } from '@/api/channels/#channel_id/messages';
import { APIMessageArray } from '@/schemas/responses';
import { GatewaySocket } from '@/render/lib/socket';

export namespace Channel {
    export type Props = {};
}
const _Channel = ({}: Channel.Props) => {
    const channelID = useRoute(ChannelRouter).at(-1)!;
    const guildID = useRoute(GuildRouter).at(-1)!;
    const [messages, setMessages] = useState([] as APIMessageArray);
    const channelName = useChannels(guildID).find((c) => c.id == channelID)?.name;

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
    }, [channelID]);

    useEffect(() => {
        const controller = new AbortController();

        GatewaySocket.addEventListener('MESSAGE_CREATE', (ev) => {
            if (ev.detail.channel_id != channelID) {
                return;
            }
            setMessages((messages) => {
                return [...messages, ev.detail];
            });
        });

        return () => controller.abort();
    }, [channelID]);

    return <div class={style.channel}>
        {channelName}
        <ul
            ref={(r) => r?.scrollTo(0, r.scrollHeight)}
        >
            {messages.map((m) =>
                <li>
                    {m.author?.username}#{m.author?.discriminator}: {m.content}
                </li>
            )}
        </ul>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector('input')!;
                sendMessage(channelID, {
                    content: input.value,
                });

                input.value = '';
            }}
        >
            <input type='text' />
            <input type='submit' hidden />
        </form>
    </div>;
};
export const Channel = memo(_Channel);
