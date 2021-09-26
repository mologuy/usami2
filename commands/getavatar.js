const data = {
    name: "getavatar",
    description: "Gets the profile picture of a certain user. Defaults to the executing user.",
    options: [{
        name: "user",
        type: "USER",
        required: false,
        description: "The user to get the avatar from."
    }]
}

/**
 * @param {import("discord.js").CommandInteraction} interaction 
 */
async function run(interaction) {
    var user = interaction.options.getUser("user");
    if (!user) {
        user = interaction.user;
    }
    const avatarurl = user.avatarURL({dynamic: true, size: 4096});
    if (avatarurl) {
        await interaction.reply(avatarurl);
    }
    else {
        await interaction.reply("Sorry. That user doesn't seem to have a profile picture.");
    }
}

module.exports = {data, run};