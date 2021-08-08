const Discord = require("discord.js");

const dadbot = require("./misc/dadbot.js");
const sixtynine = require("./misc/sixtynine.js");

const OPTIONS = require("./options.json");

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] })

let MAIN_GUILD;
client.once("ready", async ()=>{
    console.log("Logged in as", client.user.tag);
	MAIN_GUILD = client.guilds.cache.get(OPTIONS.main_guild_id);

	const pingdata = {
		name: 'ping',
		description: 'Replies with Pong!',
	};

	const addonedata = {
		name: "addone",
		description: "adds one to an integer",
		options: [{
			name: "number",
			type: "INTEGER",
			required: true,
			description: "the number to add one to"
		}]
	}

	const commands = [pingdata, addonedata];

	//await client.application?.commands.create(pingdata);

	//await MAIN_GUILD.commands.create(pingdata);
	//await MAIN_GUILD.commands.create(pongdata);

	MAIN_GUILD.commands.set(commands);

	console.log(commands);
});

client.on("messageCreate", async (msg)=>{
	dadbot.run(msg);
	sixtynine.run(msg);
});

client.on("interactionCreate", async (interaction)=>{
	if (!interaction.isCommand()) return;

	switch (interaction.commandName) {
		case "ping":
			interaction.reply("Pong!");
			break;
		case "pong":
			interaction.reply("Ping!");
			break;
		case "addone":
			var num = interaction.options.getInteger("number");
			num++;
			interaction.reply(num.toString());
			break;
		default:
			interaction.reply(`Unknown command: \`${interaction.commandName}\``);
			break;
	}
});

client.login(OPTIONS.token);