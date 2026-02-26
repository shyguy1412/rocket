import { useApi } from '@/api';
import { getMessages } from '@/api/channels/#channel_id/messages';
import { getGatewaySocket, useGateway } from '@/render/lib/socket';
import { InstanceStore, useInstance } from '@/render/store/Instance';
import { APIMessageArray } from '@/schemas/responses';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store-react';
import { useContext, useEffect, useMemo, useState } from 'preact/hooks';

type MessageStoreContext = {
    [instance: string]: {
        [channel: string]: {
            messages: APIMessageArray;
        };
    };
};

export const MessageStore = createStore({
    context: JSON.parse(
        localStorage.getItem('message-store') ?? '{}',
    ) as Partial<MessageStoreContext>,
    on: {
        addMessages(ctx, ev: { instance: string; messages: APIMessageArray }) {
            const channelID = ev.messages[0]?.channel_id;
            if (!channelID) {
                return ctx;
            }

            ctx[ev.instance] ??= {};
            ctx[ev.instance]![channelID] ??= { messages: [] };
            ctx[ev.instance]![channelID].messages.push(...ev.messages);
            ctx[ev.instance]![channelID] = {
                messages: ctx[ev.instance]![channelID].messages,
            };

            return { ...ctx };
        },
    },
});

MessageStore.subscribe((state) => {
    // localStorage.setItem('message-store', JSON.stringify(state.context));
});

const CacheMap: Record<string, boolean> = {};

export function useMessages(channelID: string) {
    const empty = useMemo(() => [], []);
    const instance = useInstance();
    const apiUrl = instance.api.baseUrl;
    const getChannelMessages = useApi(getMessages);
    const gateway = useGateway();

    const messages = useSelector(MessageStore, (state) => {
        return state.context[apiUrl]?.[channelID];
    })?.messages.slice(-51) ?? empty;

    useEffect(() => {
        if (channelID in CacheMap) {
            return;
        }
        CacheMap[channelID] = true;

        const controller = new AbortController();

        const messageCreateHandler = (ev: CustomEvent) => {
            if (ev.detail.channel_id != channelID) {
                return;
            }

            MessageStore.trigger.addMessages({
                instance: apiUrl,
                messages: [ev.detail],
            });
        };

        const subscribeToGateway = () => {
            gateway.addEventListener('MESSAGE_CREATE', messageCreateHandler, {
                signal: controller.signal,
            });
        };

        getChannelMessages(channelID)
            .then((response) => response.unwrap().toReversed())
            .then((messages) =>
                MessageStore.trigger.addMessages({ instance: apiUrl, messages })
            ).then(subscribeToGateway);

        return () => controller.abort();
    }, [apiUrl, channelID]);

    return messages == empty ? undefined : messages;
}
