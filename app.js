const Discord = require("discord.js");

const ping = require("./commands/ping.js");
const addone = require("./commands/addone.js");

const dadbot = require("./misc/dadbot.js");
const sixtynine = require("./misc/sixtynine.js");

const OPTIONS = require("./options.json");

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] })

let MAIN_GUILD;
client.once("ready", async ()=>{
    console.log("Logged in as", client.user.tag);
	MAIN_GUILD = client.guilds.cache.get(OPTIONS.main_guild_id);

	const commands = [ping.data, addone.data];

	MAIN_GUILD.commands.set(commands);

	console.log(commands);
});

client.on("messageCreate", async (msg)=>{
	dadbot.run(msg);
	sixtynine.run(msg);
});

client.on("interactionCreate", async (interaction)=>{
	if (!interaction.isCommand()) {return;}

	switch (interaction.commandName) {
		case "ping":
			ping.run(interaction);
			break;
		case "addone":
			addone.run(interaction);
			break;
		default:
			interaction.reply(`Unknown command: \`${interaction.commandName}\``);
			break;
	}
});

client.login(OPTIONS.token);