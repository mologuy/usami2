const data = {
    name: 'ping',
    description: 'Replies with Pong!',
};

async function run(interaction) {
    interaction.reply("Pong!");
}

module.exports = { data, run };