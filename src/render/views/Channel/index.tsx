import style from './Channel.module.css';

import { h, TargetedSubmitEvent } from 'preact';
import { memo } from 'preact/compat';

import { useRoute } from '@/lib/Router';
import { ChannelRouter } from '@/render/views/Guild';
import { Lumber } from '@/lib/log/Lumber';
import { useChannels } from '@/render/store/Channel';
import { GuildRouter } from '@/render/views/Home';
import { sendMessage } from '@/api/channels/#channel_id/messages';
import { Message } from '@/render/components/Message';
import { useMessages } from '@/render/hooks/useMessages';
import { useInstance } from '@/render/hooks/useInstance';

export namespace Channel {
    export type Props = {};
}
const _Channel = ({}: Channel.Props) => {
    const channelID = useRoute(ChannelRouter).at(-1)!;
    const guildID = useRoute(GuildRouter).at(-1)!;
    const channelName = useChannels(guildID).find((c) => c.id == channelID)?.name;
    const messages = useMessages(channelID);
    const instance = useInstance();

    Lumber.log(Lumber.RENDER, 'CHANNEL RENDER');

    const onSubmit = (e: TargetedSubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = e.currentTarget.querySelector('input')!;
        sendMessage(instance, channelID, {
            content: input.value,
        });

        input.value = '';
    };

    return <div class={style.channel}>
        {channelName}
        <ul
            ref={(r) => r?.scrollTo(0, r.scrollHeight)}
        >
            {messages.map((m, i) => <Message key={i} message={m} />)}
        </ul>
        <form
            onSubmit={onSubmit}
        >
            <input type='text' />
            <input type='submit' hidden />
        </form>
    </div>;
};
export const Channel = memo(_Channel);
