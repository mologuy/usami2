const Discord = require("discord.js");
const fs = require("fs/promises");
const path = require("path");

const minecraft_conntroller = require("./minecraft-controller.js");
const OPTIONS = require("./options.json");

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] })

/**
 * @type {Array<Discord.ApplicationCommandData>}
 */
let COMMAND_DATA = [];

client.once("ready", async ()=>{
	try {
		console.log("Logged in as", client.user.tag);
		client.user.setActivity(`Love, love!`);

		if (OPTIONS.enable_minecraft) {
			minecraft_conntroller.start(client);
		}
		else {
			COMMAND_DATA = COMMAND_DATA.filter((data) => data.name != 'minecraft');
		}

		for (const [id, guild] of client.guilds.cache) {
			await guild.commands.set(COMMAND_DATA);
		}
	}
	catch(e) {
		console.log(e);
	}
});

/**
 * @returns {Promise<void>}
 */
async function loadCommands() {
	const commFiles = await fs.readdir("./commands");
	for (const file of commFiles) {
		if (file.match(/\.js$/i)) {
			/**
			 * @type {{data: Discord.ApplicationCommandData, run: (interaction: Discord.CommandInteraction) => Promise<any>}}
			 */
			const module = require(path.join(__dirname, "commands", file));
			COMMAND_DATA.push(module.data);
			client.on("interactionCreate", async (interaction)=>{
				if (!interaction.isCommand()) {return;}
				if (interaction.commandName != module.data.name) {return;}
				try {
					await module.run(interaction);
				}
				catch (e) {
					console.error(e);
					const output = "An Error Ocurred. Please consult the logs for more info.";
					if (interaction.replied) {
						interaction.editReply(output);
					}
					else {
						interaction.reply(output);
					}
				}
			});
		}
	}
	return;
}

/**
 * @returns {Promise<void>}
 */
async function loadMiscs() {
	const miscFiles = await fs.readdir("./misc");

	for (const file of miscFiles) {
		if (file.match(/\.js$/i)) {
			/**
			 * @type {{run: (msg: Discord.Message) => Promise<any>}}
			 */
			const module = require(path.join(__dirname, "misc", file));
			//MISCS.push(module);
			client.on("messageCreate", async (msg)=>{
				if (msg.author.bot) {return;}
				if (msg.webhookId) {return;}
				try {
					await module.run(msg);
				}
				catch(e) {
					console.log(e);
				}
			});
		}
	}

}

//main function
(async function(){
	await loadCommands();
	await loadMiscs();
	await client.login(OPTIONS.token);
})();