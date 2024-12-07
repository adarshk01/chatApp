import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const httpServer = app.listen(8080);
const clients = new Map<string, WebSocket>();
const wss = new WebSocketServer({ server: httpServer });

function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9);
}
wss.on("connection", function connection(ws) {
  ws.on("error", console.error);
  const clientId = generateUniqueId();
  clients.set(clientId, ws);

  ws.send(JSON.stringify({ type: "id", id: clientId }));
  ws.on("message", function message(data: any) {
    const parsedData = JSON.parse(data.toString());

    // Check if the target client exists
    const targetClient = clients.get(parsedData.to);
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

  ws.send("Hello! Message From Server!!");
});
