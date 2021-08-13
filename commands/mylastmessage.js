const data = {
    name: 'mylastmessage',
    description: 'Replies with your last message on the channel',
};

const sleep = function(ms) {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(resolve,ms);
        }
        catch(e) {
            reject();
        }
    });
}

async function run(interaction) {
    await interaction.deferReply();
    const messages = await interaction.channel.messages.fetch({limit: 100});
    const lastusermessage = messages.filter((message) => message.author.id === interaction.user.id).first();
    await sleep(3000);
    await interaction.editReply(lastusermessage.content);
}

module.exports = { data, run };