import express from "express";
import { WebSocketServer, WebSocket } from "ws";

type MyObject = { [key: string]: any };

const app = express();
const httpServer = app.listen(8080);
const cli = new Map<string, WebSocket>();
const wss = new WebSocketServer({ server: httpServer });
let cliObj: MyObject = {};
let clientHub: string[] = [];
const receiver: { [key: string]: string } = {};

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
    console.log(parsedData);

    if (parsedData.event === "message") {
      let tempObj = JSON.parse(JSON.stringify(parsedData.content));

      // let tempObj = JSON.parse(JSON.stringify(parsedData.content));

      // if (parsedData.type === "private") {
      //   // Check if the target client exists
      //   const targetClient = JSON.parse(JSON.stringify(parsedData.to));
      //   if (targetClient && targetClient.readyState === WebSocket.OPEN) {
      //     targetClient.send(
      //       JSON.stringify({
      //         type: "private",
      //         from: clientId,
      //         message: parsedData.message,
      //       })
      //     );
      //   }
      // }
      Object.assign(cliObj, tempObj);
      // console.log("Received message:", cliObj);

      if (parsedData.content.type !== "private") {
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
      }
    } else if (parsedData.event === "newMessage") {
      const { to, sender, message: messageContent } = parsedData.content;

      // const msg = JSON.parse(JSON.stringify(parsedData.messageInfo));

      // Check if the target client exists
      const targetClient = cli.get(to);

      // const targetClient = JSON.parse(JSON.stringify(parsedData.to));

      if (targetClient && targetClient.readyState === WebSocket.OPEN) {
        targetClient.send(
          JSON.stringify({
            type: "private",
            from: sender,
            message: messageContent,
          })
        );
      }
      const senderClient = cli.get(sender);
      if (senderClient && senderClient.readyState === WebSocket.OPEN) {
        senderClient.send(
          JSON.stringify({
            type: "receipt",
            to: to,
            message: messageContent,
            status: "delivered", // Or any relevant status
          })
        );
      }
    }
  });

  ws.on("close", () => {
    // Remove the client ID from the connected clients array
    clientHub = clientHub.filter((id) => id !== clientId);
    // console.log(`Client disconnected: ${clientId}`);

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
