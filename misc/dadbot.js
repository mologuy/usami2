async function dad(msg) {
    const dadmatch = msg.content.match(/^(i\W*m|i\s+am)\s+(.*)/i);
    if (!dadmatch) {
        return;
    }
    
    const name = dadmatch[2];

    const webhook = await msg.channel.createWebhook(`${msg.author.username}'s dad`, {avatar: "https://static.mologuy.com/images/discord/dad_pfp.jpg"})
    let output;
    if (name.match(/^\W*dad\W*$/i)){
        output = `No you're not. You're ${msg.author.username}!`
    }
    else {
        output = `Hi, ${name}! I'm dad.`;
    }
    await webhook.send(output);
    await webhook.delete();
}

module.exports = {run: dad};