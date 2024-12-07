"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const app = (0, express_1.default)();
const httpServer = app.listen(8080);
const clients = new Map();
const wss = new ws_1.WebSocketServer({ server: httpServer });
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}
wss.on("connection", function connection(ws) {
    ws.on("error", console.error);
    const clientId = generateUniqueId();
    clients.set(clientId, ws);
    ws.send(JSON.stringify({ type: "id", id: clientId }));
    ws.on("message", function message(data) {
        const parsedData = JSON.parse(data.toString());
        if (parsedData.type === "private") {
            // Check if the target client exists
            const targetClient = clients.get(parsedData.to);
            if (targetClient && targetClient.readyState === ws_1.WebSocket.OPEN) {
                targetClient.send(JSON.stringify({
                    type: "private",
                    from: clientId,
                    message: parsedData.message,
                }));
            }
        }
        else if (parsedData.type === "broadcast") {
            // Broadcast to all clients
            wss.clients.forEach(function each(client) {
                if (client.readyState === ws_1.WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: "broadcast",
                        from: clientId,
                        message: parsedData.message,
                    }));
                }
            });
        }
    });
    ws.send("Hello! Message From Server!!");
});
