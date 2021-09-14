const WebSocket = require("ws");

const server = new WebSocket.Server({port: 3003, path: "/"});

server.on("connection", (socket)=>{
    console.log("new connection");
    socket.on("message", (data)=>{
        console.log("%s", data);
    });
});