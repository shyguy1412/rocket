export const openWebsocket = () => {
    const socket = new WebSocket(
        'wss://gateway.rory.server.spacebar.chat/?encoding=json&v=9',
    );

    return new Promise<WebSocket>((r) =>
        socket.addEventListener('open', () => r(socket), { once: true })
    );
};
