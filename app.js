const Discord = require("discord.js");
const fs = require("fs/promises");
const path = require("path");

const OPTIONS = require("./options.json");

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] })

var COMMANDS = new Map();
var MISCS = [];

function getCommandsDataArray(commandMap) {
	var output = [];
	commandMap.forEach((value)=>{
		output.push(value.data);
	});
	return output;
}

client.once("ready", async ()=>{
	try {
		console.log("Logged in as", client.user.tag);
		client.user.setActivity(`Love, love!`);

		const commandsData = getCommandsDataArray(COMMANDS);
		await client.guilds.cache.get(OPTIONS.main_guild_id).commands.set(commandsData);
	}
	catch(e) {
		console.log(e);
	}
});

client.on("messageCreate", async (msg)=>{
	if (msg.author.bot) {return;}
	if (msg.webhookId) {return;}

	try {
		for (const misc of MISCS) {
			misc.run(msg);
		}
	}
	catch (e) {
		console.log(e);
	}
});

client.on("interactionCreate", async (interaction)=>{
	if (!interaction.isCommand()) {return;}

	try {
		if (COMMANDS.has(interaction.commandName)) {
			await COMMANDS.get(interaction.commandName).run(interaction);
		}
		else {
			await interaction.reply(`Unknown command: \`${interaction.commandName}\``);
		}
	}
	catch(e) {
		console.log(e);
	}
});

//main function
(async function(){
	const commFiles = await fs.readdir("./commands");

	for (const file of commFiles) {
		if (file.match(/\.js$/i)) {
			const module = require(path.join(__dirname, "commands", file));
			if (COMMANDS.has(module.data.name)) {
				throw new Error("Repeated command name!");
			}
			else {
				COMMANDS.set(module.data.name, module);
			}
		}
	}

	const miscFiles = await fs.readdir("./misc");

	for (const file of miscFiles) {
		if (file.match(/\.js$/i)) {
			const module = require(path.join(__dirname, "misc", file));
			MISCS.push(module);
		}
	}

	client.login(OPTIONS.token);
	
})();