import { getMessages } from '@/api/channels/#channel_id/messages';
import { GatewaySocket } from '@/render/lib/socket';
import { APIMessageArray } from '@/schemas/responses';
import { useCallback, useEffect, useState } from 'preact/hooks';

export function useMessages(channelID: string) {
    const [messages, setMessages] = useState([] as APIMessageArray);

    const getChannelMessages = useCallback(
        () => getMessages(channelID),
        [channelID],
    );
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

    return messages;
}
