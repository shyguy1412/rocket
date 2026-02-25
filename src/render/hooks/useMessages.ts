import { useApi } from '@/api';
import { getMessages } from '@/api/channels/#channel_id/messages';
import { getGatewaySocket } from '@/render/lib/socket';
import { useInstance } from '@/render/store/Instance';
import { useProfile } from '@/render/store/Profile';
import { APIMessageArray } from '@/schemas/responses';
import { useEffect, useState } from 'preact/hooks';

export function useMessages(channelID: string) {
    const [messages, setMessages] = useState([] as APIMessageArray);

    const getChannelMessages = useApi(getMessages);
    const gateway = useInstance().gateway.baseUrl;

    useEffect(() => {
        setMessages([]);
        getChannelMessages(channelID)
            .then((response) => response.unwrap())
            .then((messages) => setMessages(messages.toReversed()))
            .catch((err) => console.error(err));
    }, [channelID]);

    useEffect(() => {
        const controller = new AbortController();
        const GatewaySocket = getGatewaySocket(gateway);

        GatewaySocket.addEventListener('MESSAGE_CREATE', (ev) => {
            if (ev.detail.channel_id != channelID) {
                return;
            }
            setMessages((messages) => {
                return [...messages, ev.detail];
            });
        }, { signal: controller.signal });

        return () => controller.abort();
    }, [channelID, gateway]);

    return messages;
}
