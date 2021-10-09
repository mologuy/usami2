const client_io = require("socket.io-client");
//const server_io = require("socket.io");
const Discord = require("discord.js");
const options = require("./options.json").minecraft;
const mc_util = require("minecraft-server-util");
const { Rcon } = require("rcon-client");

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
    const output = `[Chat] **<${data.username}>** ${data.message}`;
    await chatChannel?.send(output);
}

/**
 * @param {{username: string, date: date}} data 
 */
 async function onJoined(data) {
    const output = `[Connection] **${data.username}** joined the game`;
    await chatChannel?.send(output);
}

/**
 * @param {{username: string, date: date}} data 
 */
 async function onLeft(data) {
    const output = `[Connection] **${data.username}** left the game`;
    await chatChannel?.send(output);
}

/**
 * @param {{message: string}} data 
 */
async function onServerReady(data) {
    if (data.message.match(/\S/g)) {
        await consoleChannel?.send(data.message);
    }
    else {
        await consoleChannel?.send("Server ready!");
    }
}

/**
 * @param {string} command 
 * @returns {Promise<string>}
 */
async function rconPromise(command) {
    const rcon = new Rcon({ host: options.server_hostname, port: options.rcon_port, password: options.rcon_password});
   
    consoleChannel?.send(`[RCON command]: ${command}`)
    .catch((e)=>{console.log(e)});

    await rcon.connect();
    const output = await rcon.send(command);
    rcon.end();
    
    consoleChannel?.send(`[RCON output]: ${output}`)
    .catch((e)=>{console.log(e)});

    return output;
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
            name: "Server Address",
            value: `${response.host}${port}`
        },
        {
            name: "Server Name",
            value: `\u200B${response.description?.descriptionText}`
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
        if (msg.member.roles.cache.has(options.minecraft_op_role)) {
            await rconPromise(msg.content);
        }
        //console.log(output);
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
        const content = msg.content.substr(0, 256);
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
            ioSocket.on("serverReady", onServerReady);
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