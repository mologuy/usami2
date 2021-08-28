const roleId = require("../options.json").dad_ignore_role;

const data = {
    name: "dadignore",
    description: "Toggles the ignore role for Dadbot"
}


async function run(interaction) {
    if (!interaction.guild.roles.cache.has(roleId)) {
        await interaction.reply("The ignore role doesn't seem to exist...");
        return;
    }

    if (interaction.member.roles.cache.has(roleId)) {
        await interaction.member.roles.remove(roleId);
        await interaction.reply("Removed the ignore role!");
    }
    else {
        await interaction.member.roles.add(roleId);
        await interaction.reply("Added the ignore role!");
    }
}

module.exports = {data, run};