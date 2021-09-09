const io = require("socket.io-client");
const Discord = require("discord.js");
const options = require("./options.json").minecraft;

/**
 * @type {URL}
 */
let url;

/**
 * @type {Discord.TextChannel}
 */
let consoleChannel;

/**
 * @type {Discord.TextChannel}
 */
let chatChannel;

/**
 * @type {io.Socket}
 */
let ioSocket;

/**
 * @type {Discord.Client}
 */
let discordClient;

/**
 * @param {{line: String, date: Date}} data 
 */
async function onConsole(data) {
    await consoleChannel?.send(data.line);
}

/**
 * @param {{message: string, username: string, date: date}} data 
 */
async function onChat(data) {
    const output = `[Minecraft Server] **<${data.username}>** ${data.message}`;
    await chatChannel?.send(output);
}

/**
 * @param {{username: string, date: date}} data 
 */
 async function onJoined(data) {
    const output = `[Minecraft Server] **${data.username}** joined the game`;
    await chatChannel?.send(output);
}

/**
 * @param {{username: string, date: date}} data 
 */
 async function onLeft(data) {
    const output = `[Minecraft Server] **${data.username}** left the game`;
    await chatChannel?.send(output);
}

/**
 * @param {Discord.Client} client 
 */
function main(client) {
    discordClient = client;

    url = new URL("ws://localhost");
    url.hostname = options.server_hostname;
    url.port = options.socket_io_port;

    ioSocket = io(url.toString());

    consoleChannel = client.channels.cache.get(options.console_channel);
    chatChannel = client.channels.cache.get(options.chat_channel);

    if (consoleChannel) {
        ioSocket.on("console", onConsole);
    }

    if (chatChannel) {
        ioSocket.on("chat", onChat);
        ioSocket.on("joined", onJoined);
        ioSocket.on("left", onLeft);
    }

    //client.on("messageCreate", ()=>{});
}

module.exports = {start: main};