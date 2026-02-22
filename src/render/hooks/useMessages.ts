import { getMessages } from '@/api/channels/#channel_id/messages';
import { useInstance } from '@/render/hooks/useInstance';
import { getGatewaySocket } from '@/render/lib/socket';
import { APIMessageArray } from '@/schemas/responses';
import { useCallback, useEffect, useState } from 'preact/hooks';

export function useMessages(channelID: string) {
    const [messages, setMessages] = useState([] as APIMessageArray);

    const instance = useInstance();

    useEffect(() => {
        const getChannelMessages = useCallback(
            () => getMessages(instance, channelID),
            [channelID],
        );

        getChannelMessages()
            .then((response) => response.unwrap())
            .then((messages) => setMessages(messages.toReversed()))
            .catch((err) => console.error(err));
    }, [instance, channelID]);

    useEffect(() => {
        const controller = new AbortController();
        const GatewaySocket = getGatewaySocket('');

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
