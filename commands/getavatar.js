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
    const avatarurl = user.avatarURL();
    interaction.reply(avatarurl);
}

module.exports = {data, run};