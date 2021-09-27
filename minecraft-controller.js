const client_io = require("socket.io-client");
//const server_io = require("socket.io");
const Discord = require("discord.js");
const options = require("./options.json").minecraft;
const mc_util = require("minecraft-server-util");

/**
 * @type {Discord.TextChannel}
 */
let consoleChannel;

/**
 * @type {Discord.TextChannel}
 */
let chatChannel;

/**
 * @type {client_io.Socket}
 */
let ioSocket;

/**
 * @param {{line: String, date: Date}} data 
 */
async function onConsole(data) {
    await consoleChannel?.send(data.line);
}

/**
 * @param {{message: string, username: string, date: Date}} data 
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
        
        rcon.once("output", (output)=>{
            rcon.close();
            resolve(output);
        });

        rcon.once("error", (e)=>{
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
 * @returns {Promise<Discord.MessageEmbed>}
 */
async function getStatusEmbed() {
    let response;
    let error = false;
    try {
        response = await mc_util.status(options.server_hostname, {port: options.server_port});
    }
    catch (e) {
        error = true;
        response = {host: options.server_hostname, description: {descriptionText: "Unavailable"}, version: "N/A", onlinePlayers: 0, maxPlayers: 0};
    }
    let port = "";
    if (options.server_port != 25565) {
        port = `:${options.server_port}`;
    }
    const msgEmbed = new Discord.MessageEmbed()
    .setColor('#228B22')
    .setTitle('Minecraft server info')
    .setThumbnail("https://static.mologuy.com/images/mc-server/minecraft_icon.png")
    .addFields(
        {
            name:"URL",
            value: `${response.host}${port}`
        },
        {
            name: "Name",
            value: response.description?.descriptionText
        },
        {
            name: '\u200B',
            value: '\u200B'
        },
        {
            name:"Version",
            value: `Java ${response.version}`,
            inline: true
        },
        {
            name:"Status",
            value: (error ? "Offline" : "Online"),
            inline: true
        },
        {
            name:"Players",
            value: `${response.onlinePlayers}/${response.maxPlayers}`,
            inline: true
        },
        {
            name:"Join command",
            value: "`/minecraft join [minecraft_username]`"
        }
    )
    return msgEmbed;
}

/**
 * @param {Discord.Message} msg 
 */
async function onMsgConsole(msg) {
    if (msg.author.bot) {return;}
    if (msg.channel.id != consoleChannel?.id) {return;}

    try {
        const output = await rconPromise(msg.content);
        //console.log(output);
        if (output.match(/\S/)) {
            await msg.channel.send(`[RCON Output]: ${output}`);
        }
    }
    catch(e) {
        console.log(e);
    }
}

/**
 * @param {Discord.Message} msg 
 */
async function onMsgChat(msg) {
    if (msg.author.bot) {return;}
    if (msg.channel.id != chatChannel?.id) {return;}

    try {
        const content = msg.content.replace(/[^ -~]/g, "?").substr(0, 255);
        const tellraw = [{text: "[Discord]", color: "light_purple", bold: true}, {text: ` <${msg.author.username}> ${content}`, color: "white", bold: false}]
        const output = `tellraw @a ${JSON.stringify(tellraw)}`;
        await rconPromise(output);
    }
    catch(e) {
        console.log(e);
    }
}

/**
 * @param {Discord.Client} client 
 */
async function main(client) {

    consoleChannel = client.channels.cache.get(options.console_channel);
    chatChannel = client.channels.cache.get(options.chat_channel);

    if (consoleChannel || chatChannel) {
        let serverURL = new URL("ws://localhost/");
        serverURL.hostname = options.server_hostname;
        serverURL.port = options.socket_io_port;
        ioSocket = client_io(serverURL.toString());
        ioSocket.on("connect",()=>{console.log("Socket connected");});
        ioSocket.on("disconnect",()=>{console.log("Socket disconnected");});

        if (consoleChannel) {
            ioSocket.on("console", onConsole);
        }

        if (chatChannel) {
            ioSocket.on("chat", onChat);
            ioSocket.on("joined", onJoined);
            ioSocket.on("left", onLeft);
        }

    }
    
    if (options.rcon_password) {
        if (consoleChannel) { 
            client.on("messageCreate", onMsgConsole);
        }
        if (chatChannel) {
            client.on("messageCreate", onMsgChat);
        }
    }
    return;
}

module.exports = {start: main, rcon: rconPromise, status: getStatusEmbed};