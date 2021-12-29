const ws = require('ws')

const wsServer = new ws.Server({
  noServer: true,
  path: "/api/ws"
});

const broadcastMessage = (message) => {
  wsServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message, { binary: false });
    }
  });
}

const setupWebsocket = (server) => {
  wsServer.on('connection', socket => {
    socket.on('message', message => console.log(message));
  });

  server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
      wsServer.emit('connection', socket, request);
    });
  });

  wsServer.on(
    "connection",
    function connection(websocketConnection, connectionRequest) {
      const [_path, params] = connectionRequest?.url?.split("?");
      const connectionParams = queryString.parse(params);

      // NOTE: connectParams are not used here but good to understand how to get
      // to them if you need to pass data with the connection to identify it (e.g., a userId).
      console.log(connectionParams);

      websocketConnection.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        console.log(parsedMessage);
        websocketClient.send(JSON.stringify({ message: 'There be gold in them thar hills.' }));
      });
    }
  );

  return wsServer
}


module.exports = {
  setupWebsocket,
  wsServer,
  broadcastMessage,
}
