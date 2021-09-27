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
        name: "join",
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
 * @returns {Promise<void>}
 */
async function statusSubCom(interaction) {
    await interaction.deferReply();
    const embed = await mc_controller.status();
    await interaction.editReply({embeds: [embed]});
    return;
}

/**
 * @param {Discord.CommandInteraction} interaction
 * @returns {Promise<void>}
 */
 async function whitelistSubCom(interaction) {
    await interaction.deferReply();
    const username = interaction.options.getString("mc_username").replace(/\W/,"");
    const output = await mc_controller.rcon(`whitelist add ${username}`);
    if (output) {
        await interaction.editReply(output);
    }
    else {
        await interaction.editReply(`An error occured. Invalid username?`);
    }
    return;
}

/**
 * @param {Discord.CommandInteraction} interaction
 * @returns {Promise<void>}
 */
 async function rconSubCom(interaction) {
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

/**
 * @param {Discord.CommandInteraction} interaction
 */
async function run(interaction) {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
        case undefined:
        case "status":
            await statusSubCom(interaction);
            break;
        case "join":
            await whitelistSubCom(interaction);
            break;
        case "rcon":
            await rconSubCom(interaction);
            break;
        default:
            await interaction.reply("Unknown subcommand.");
            break;
    }
}

module.exports = {data, run}