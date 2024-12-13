import express from "express";
import { WebSocketServer, WebSocket } from "ws";

type MyObject = { [key: string]: any };

const app = express();
const httpServer = app.listen(8080);
const cli = new Map<string, WebSocket>();
const wss = new WebSocketServer({ server: httpServer });
let cliObj: MyObject = {};
let clientHub: string[] = [];

function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9);
}
wss.on("connection", function connection(ws) {
  ws.on("error", console.error);
  const clientId = generateUniqueId();
  clientHub.push(clientId);
  cli.set(clientId, ws);

  ws.send(JSON.stringify({ type: "id", id: clientId }));
  ws.on("message", function message(data: any, message) {
    const parsedData = JSON.parse(data.toString());

    const tempObj = JSON.parse(JSON.stringify(parsedData.content));
    Object.assign(cliObj, tempObj);
    console.log("Received message:", cliObj);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "clientList",
            cliObj: cliObj,
          })
        );
      }
    });

    // Check if the target client exists
    const targetClient = cli.get(parsedData.to);
    if (targetClient && targetClient.readyState === WebSocket.OPEN) {
      targetClient.send(
        JSON.stringify({
          type: "private",
          from: clientId,
          message: parsedData.message,
        })
      );
    }
  });

  ws.on("close", () => {
    // Remove the client ID from the connected clients array
    clientHub = clientHub.filter((id) => id !== clientId);
    console.log(`Client disconnected: ${clientId}`);

    // Send the updated list of connected clients
    delete cliObj[clientId];
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "clientList",
            cliObj: cliObj,
          })
        );
      }
    });
  });

  ws.send("Hello! Message From Server!!");
});
