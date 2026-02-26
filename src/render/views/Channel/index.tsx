import style from './Channel.module.css';

import { h, TargetedSubmitEvent } from 'preact';
import { memo, useEffect, useRef } from 'preact/compat';

import { useRoute } from '@/lib/Router';
import { ChannelRouter } from '@/render/views/Guild';
import { Lumber } from '@/lib/log/Lumber';
import { sendMessage } from '@/api/channels/#channel_id/messages';
import { Message } from '@/render/components/Message';
import { useMessages } from '@/render/store/Profile/Message';
import { useChannel } from '@/render/store/Profile/Guild';
import { useApi } from '@/api';

export namespace Channel {
    export type Props = {};
}

const _Channel = ({}: Channel.Props) => {
    Lumber.log(Lumber.RENDER, 'CHANNEL RENDER');

    const [channelID] = useRoute(ChannelRouter);
    const channelName = useChannel(channelID)?.channel.name;
    const messages = useMessages(channelID);
    const ulRef = useRef<HTMLUListElement>(null);

    const sendChannelMessage = useApi(sendMessage).bind(undefined, channelID);

    const onSubmit = (e: TargetedSubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = e.currentTarget.querySelector('input')!;
        sendChannelMessage({
            content: input.value,
        });
        input.value = '';
    };

    useEffect(() => {
        if (!ulRef.current) {
            return;
        }
        const ul = ulRef.current;
        ul.scrollTo(0, ul.scrollHeight);

        const graceArea = 10;
        let height = ul.scrollHeight - ul.clientHeight;

        const observer = new MutationObserver(() => {
            if (ul.scrollTop >= height - graceArea) {
                ul.scrollTo(0, ul.scrollHeight);
                height = ul.scrollHeight - ul.clientHeight;
            }
        });

        observer.observe(ul, { childList: true });

        return () => observer.disconnect();
    }, [ulRef, channelID, messages == undefined]);

    return <div class={style.channel}>
        {channelName}
        <ul
            ref={ulRef}
        >
            {messages?.map((m, i) => <Message key={i} message={m} />)}
        </ul>
        <form onSubmit={onSubmit}>
            <input type='text' />
            <input type='submit' hidden />
        </form>
    </div>;
};
export const Channel = memo(_Channel);
