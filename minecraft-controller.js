const io = require("socket.io-client");

/**
 * @type {io.Socket}
 */
const socket = io();

/**
 * @param {import("discord.js").Client} client 
 */
function main(client) {
    client.on("messageCreate", ()=>{});
    const socket = io();
}

module.exports = main;