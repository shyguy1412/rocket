export type GatewayEvent = 'MESSAGE_CREATE' | 'MESSAGE_UPDATE';

type CustomEventHandler = (ev: CustomEvent) => void;
type addCustomEventListener = (
    event: string,
    handler: CustomEventHandler | null,
    options?: AddEventListenerOptions,
) => void;

type GatewaySocket = {
    addEventListener: addCustomEventListener;
    dispatchEvent: EventTarget['dispatchEvent'];
    removeEventListener: EventTarget['removeEventListener'];
};

const RETRY_COUNT = 3;
let current_try = 0;

const sockets: Record<string, GatewaySocket> = {};

export const getGatewaySocket = (url: string, token: string) => {
    if (url in sockets) {
        return sockets[url];
    }

    let socket: WebSocket;

    const reconnect = () => {
        if (current_try >= RETRY_COUNT) {
            throw new Error('Can not connect to gateway');
        }
        current_try += 1;

        socket = new WebSocket(url);

        socket.addEventListener('open', () => setupSocket(socket), { once: true });
        socket.addEventListener('open', () => current_try = 0, { once: true });
        socket.addEventListener('close', reconnect);
    };

    const eventTarget = new EventTarget();
    const GatewaySocket = {
        addEventListener: eventTarget.addEventListener.bind(
            eventTarget,
        ) as addCustomEventListener,
        dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
        removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
    };

    reconnect();

    function setupSocket(socket: WebSocket) {
        socket.addEventListener('message', (ev) => {
            const data = JSON.parse(ev.data);
            if ('t' in data) {
                GatewaySocket.dispatchEvent(
                    new CustomEvent(data.t + '', { detail: data.d }),
                );
            } else {
                GatewaySocket.dispatchEvent(
                    new CustomEvent(data.op + '', { detail: data.d }),
                );
            }
        });

        //authenticate socket connection
        socket.send(JSON.stringify({
            op: 2,
            d: {
                token,
            },
        }));

        GatewaySocket.addEventListener('10', (ev: CustomEvent) => {
            let d: number | null = null;

            socket.addEventListener('message', (ev) => d = JSON.parse(ev.data).s ?? d);

            setInterval(() => {
                socket.send(JSON.stringify({ op: 1, d }));
            }, ev.detail.heartbeat_interval);
        });
    }

    sockets[url] = GatewaySocket;
    return GatewaySocket;
};
