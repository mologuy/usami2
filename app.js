const Discord = require("discord.js");

const OPTIONS = require("./options.json");

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] })

client.once("ready", async ()=>{
    console.log("Logged in as", client.user.tag);
});

client.on("messageCreate", async (msg)=>{
    if (!client.application?.owner) await client.application?.fetch();

	if (msg.content.toLowerCase() === '!deploy' && msg.author.id === client.application?.owner.id) {
		const data = {
			name: 'ping',
			description: 'Replies with Pong!',
		};

		const command = await client.application?.commands.create(data);
		console.log(command);
	}
});

client.login(OPTIONS.token);