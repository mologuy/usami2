const io_client = require("socket.io-client");
const io_server = require("socket.io");
const Discord = require("discord.js");
const options = require("./options.json").minecraft;
const mc_util = require("minecraft-server-util");

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
 * @type {io_client.Socket}
 */
let ioSocket;

/**
 * @type {io_server.Server}
 */
let ioServer;

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
 * @param {string} command 
 * @returns {Promise<string>}
 */
function rconPromise(command) {
    return new Promise((resolve, reject)=>{
        const rcon = new mc_util.RCON(options.server_hostname, {port: options.rcon_port, password: options.rcon_password});
        
        rcon.on("output", (output)=>{
            rcon.close();
            resolve(output);
        });

        rcon.on("error", (e)=>{
            rcon.close();
            reject(e);
        })

        rcon.connect()
        .then(()=>{
            rcon.run(command);
        })
        .catch((e)=>{
            reject(e);
        })
    });
}

/**
 * @param {Discord.Message} msg 
 */
async function onMsgConsole(msg) {
    if (msg.author.bot) {return;}
    if (msg.channel.id != consoleChannel.id) {return;}
    const output = await rconPromise(msg.content);
    console.log(output);
    if (output.match(/\S/)) {
        msg.channel.send(`[RCON Output]: ${output}`);
    }
}

/**
 * @param {Discord.Message} msg 
 */
async function onMsgChat(msg) {
    if (msg.author.bot) {return;}
    if (msg.channel.id != chatChannel.id) {return;}

    const content = msg.content.replace(/[^ -~]/g, "?").substr(0, 255);
    const tellraw = [{text: "[Discord]", color: "light_purple", bold: true}, {text: ` <${msg.author.username}> ${content}`, color: "white", bold: false}]
    const output = `tellraw @a ${JSON.stringify(tellraw)}`;
    await rconPromise(output);
}

/**
 * @param {Discord.Client} client 
 */
function main(client) {
    discordClient = client;

    url = new URL("ws://localhost");
    url.hostname = options.server_hostname;
    url.port = options.socket_io_port;

    ioSocket = io_client(url.toString());

    consoleChannel = client.channels.cache.get(options.console_channel);
    chatChannel = client.channels.cache.get(options.chat_channel);

    if (consoleChannel) {
        ioSocket.on("console", onConsole);
        if (options.rcon_password) {
            client.on("messageCreate", onMsgConsole);
        }
    }

    if (chatChannel) {
        ioSocket.on("chat", onChat);
        ioSocket.on("joined", onJoined);
        ioSocket.on("left", onLeft);
        if (options.rcon_password) {
            client.on("messageCreate", onMsgChat);
        }
    }

    //client.on("messageCreate", ()=>{});
}

module.exports = {start: main, rcon: rconPromise};