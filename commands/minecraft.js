const Discord = require("discord.js");
const mc_controller = require("../minecraft-controller.js");
const options = require("../options.json").minecraft;

/**
 * @type {Discord.ApplicationCommandData}
 */
const data = {
    name: "minecraft",
    description: "Commands related to the minecraft server.",
    options: [{
        type: "SUB_COMMAND",
        name: "status",
        description: "Shows server status.",
        required: false
    },{
        type: "SUB_COMMAND",
        name: "whitelist",
        description: "Adds a MC player to the whitelist.",
        required: false,
        options: [{
            type: "STRING",
            name: "mc_username",
            description: "The Minecraft username to add.",
            required: true
        }]
    },{
        type: "SUB_COMMAND",
        name: "rcon",
        description: "Executes an RCON command. (Must have appropriate role).",
        required: false,
        options: [{
            type: "STRING",
            name: "mc_command",
            description: "Command to execute.",
            required: true
        }]
    }]
};

/**
 * @param {Discord.CommandInteraction} interaction
 */
async function run(interaction) {
    try {
        const subcommand = interaction.options.getSubcommand();
        if (!subcommand || subcommand === "status") {
            await interaction.deferReply();
            const embed = await mc_controller.status();
            await interaction.editReply({embeds: [embed]});
            return;
        }
        if (subcommand === "whitelist") {
            await interaction.deferReply();
            const username = interaction.options.getString("mc_username");
            const output = await mc_controller.rcon(`whitelist add ${username}`);
            if (output) {
                await interaction.editReply(output);
            }
            else {
                await interaction.editReply(`An error occured. Invalid username?`);
            }
            return;
        }
        if (subcommand === "rcon") {
            if (interaction.member.roles.cache.has(options.minecraft_op_role)) {
                await interaction.deferReply();
                const command = interaction.options.getString("mc_command");
                var output = await mc_controller.rcon(command);
                if (!output) {
                    output = "";
                }
                await interaction.editReply(`Server response: \` ${output} \``);
            }
            else {
                await interaction.reply("You don't have the appropriate role to use this command.");
            }
            return;
        }
        await interaction.reply("Unknown subcommand.");
        return;
    }
    catch(e) {
        console.log(e);
        if (interaction.deferred) {
            await interaction.editReply("An error ocurred.");
        }
        else {
            await interaction.reply("An error ocurred.");
        }
    }
}

module.exports = {data, run}