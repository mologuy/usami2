const Discord = require("discord.js");
const fs = require("fs/promises");
const path = require("path");

const OPTIONS = require("./options.json");

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] })

let MAIN_GUILD;
var COMMANDS = [];
var MISCS = [];

client.once("ready", async ()=>{
	try {
		console.log("Logged in as", client.user.tag);
		await client.user.setActivity(`Love, love!`);

		MAIN_GUILD = client.guilds.cache.get(OPTIONS.main_guild_id);

		await MAIN_GUILD.commands.set(COMMANDS.map((command) => command.data ));

		//console.log(await MAIN_GUILD.commands.fetch());
	}
	catch(e) {
		console.log(e);
	}
});

client.on("messageCreate", async (msg)=>{
	if (msg.author.bot) {return}
	if (msg.webhookId) {return}

	try {
		for (const misc of MISCS) {
			await misc.run(msg);
		}
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

//main function
(async function(){
	const commFiles = await fs.readdir("./commands");

	for (const file of commFiles) {
		const module = require(path.join(__dirname, "commands", file));
		COMMANDS.push(module);
	}

	const miscFiles = await fs.readdir("./misc");

	for (const file of miscFiles) {
		const module = require(path.join(__dirname, "misc", file));
		MISCS.push(module);
	}

	client.login(OPTIONS.token);
})();