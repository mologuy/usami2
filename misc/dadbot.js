const Jimp = require("jimp");

async function dad(msg) {
    const dadmatch = msg.content.match(/^(i\W*m|i\s+am)\s+(.*)/i);
    if (!dadmatch) {
        return;
    }
    
    const name = dadmatch[2];

    const avatarURL = msg.author.avatarURL({size: 256, format: "png"});
    
    const avatarImg = await Jimp.read(avatarURL);
    const pipeImg = await Jimp.read("./bin/pipe.png");

    avatarImg.composite(pipeImg, 0, 0);

    const image64 = await avatarImg.getBase64Async(Jimp.MIME_PNG);

    const webhook = await msg.channel.createWebhook(`${msg.author.username}'s dad`, {avatar: image64});
    
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