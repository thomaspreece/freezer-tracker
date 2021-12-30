const ws = require('ws')
const queryString = require('query-string');

const wsServer = new ws.Server({
  noServer: true,
  path: "/api/ws"
});

const broadcastMessage = (message) => {
  wsServer.clients.forEach((client) => {
    if (client.readyState === ws.WebSocket.OPEN) {
      client.send(message, { binary: false });
    }
  });
}

const setupWebsocket = (server) => {
  server.on('upgrade', (request, socket, head) => {
    console.log("WS Upgrade")

    wsServer.handleUpgrade(request, socket, head, socket => {
      wsServer.emit('connection', socket, request);
    });
  });

  wsServer.on(
    "connection",
    function connection(websocketConnection, connectionRequest) {
      // const [_path, params] = connectionRequest?.url?.split("?");
      // const connectionParams = queryString.parse(params);
      //
      // // NOTE: connectParams are not used here but good to understand how to get
      // // to them if you need to pass data with the connection to identify it (e.g., a userId).
      // console.log(connectionParams);

      console.log("WS Connection", connectionRequest.url, connectionRequest.headers.host)

      websocketConnection.on("message", (message) => {
        try {
          const parsedMessage = JSON.parse(message);
          console.log("WebSocket Message: ", parsedMessage);
          websocketClient.send(JSON.stringify({ message: 'There be gold in them thar hills.' }));
        } catch (error) {
          console.log("WebSocket Error")
        }
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
