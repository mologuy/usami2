const Discord = require("discord.js");

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] })

client.login("NzkwMTUwODkzNDkxMzIyOTEw.X98bXQ.eUk56W7xhrcUSrteeD5gjrtr_BU");

console.log("Test");