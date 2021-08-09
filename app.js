const Discord = require("discord.js");
const fs = require("fs/promises");
const path = require("path");

const dadbot = require("./misc/dadbot.js");
const sixtynine = require("./misc/sixtynine.js");

const OPTIONS = require("./options.json");

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] })

let MAIN_GUILD;
var COMMANDS = [];
client.once("ready", async ()=>{
	try {
		console.log("Logged in as", client.user.tag);
		MAIN_GUILD = client.guilds.cache.get(OPTIONS.main_guild_id);

		const commFiles = await fs.readdir("./commands");

		for (const file of commFiles) {
			const module = require(path.join(__dirname, "commands", file));
			COMMANDS.push(module);
		}

		await MAIN_GUILD.commands.set(COMMANDS.map((command) => command.data ));

		console.log(COMMANDS);
	}
	catch(e) {
		console.log(e);
	}
});

client.on("messageCreate", async (msg)=>{
	try {
		await dadbot.run(msg);
		await sixtynine.run(msg);
	}
	catch (e) {
		console.log(e);
	}
});

client.on("interactionCreate", async (interaction)=>{
	if (!interaction.isCommand()) {return;}

	try {
		const commMatch = COMMANDS.find((command)=> command.data.name == interaction.commandName );
		if (commMatch) {
			await commMatch.run(interaction);
		}
		else {
			await interaction.reply(`Unknown command: \`${interaction.commandName}\``);
		}
	}
	catch(e) {
		console.log(e);
	}
});

client.login(OPTIONS.token);