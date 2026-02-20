import { Payload } from 'spacebar_server/src/gateway';

export type GatewayEvent = 'MESSAGE_CREATE' | 'MESSAGE_UPDATE';

type CustomEventHandler = (ev: CustomEvent) => void;
type addCustomEventListener = (
    event: string,
    handler: CustomEventHandler | null,
    options?: AddEventListenerOptions,
) => void;

const eventTarget = new EventTarget();
export const GatewaySocket = {
    addEventListener: eventTarget.addEventListener.bind(
        eventTarget,
    ) as addCustomEventListener,
    dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
    removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
};

let socket = new WebSocket(
    'wss://gateway.rory.server.spacebar.chat/?encoding=json&v=9',
);

socket.addEventListener('open', () => setupSocket(socket), { once: true });

// export const openWebsocket = async () => {
//     const socket = new WebSocket(
//         'wss://gateway.rory.server.spacebar.chat/?encoding=json&v=9',
//     );

//     await new Promise<WebSocket>((r) =>
//         socket.addEventListener('open', () => r(socket), { once: true })
//     );

//     let d: number | null = null;

//     socket.addEventListener('message', (ev) => d = JSON.parse(ev.data).s ?? d);

//     setInterval(() => {
//         socket.send(JSON.stringify({ op: 1, d }));
//     }, 30000);

//     return socket;
// };

function setupSocket(socket: WebSocket) {
    socket.addEventListener('message', (ev) => {
        const data = JSON.parse(ev.data);
        if ('t' in data) {
            GatewaySocket.dispatchEvent(new CustomEvent(data.t + '', { detail: data.d }));
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
            token: localStorage.getItem('token'),
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
function setupHeartbeat() {
}
