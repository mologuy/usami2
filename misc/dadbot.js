const Jimp = require("jimp");
const roleId = require("../options.json").dad_ignore_role;

/**
 * @typedef {import("discord.js").Webhook} Webhook
 * @typedef {import("discord.js").Message} Message
 */

/**
 * @function
 * @param {Message} msg
 * @returns {Promise<Webhook>}
 */
async function getDadHook(msg) {
    const avatarURL = msg.author.avatarURL({size: 128, format: "png"});
    
    const avatarImg = await Jimp.read(avatarURL);
    const pipeImg = await Jimp.read("./bin/pipe.png");

    avatarImg.cover(128, 128).composite(pipeImg, 0, 0);

    const image64 = await avatarImg.getBase64Async(Jimp.MIME_PNG);
    /**
     * @type {Webhook}
     */
    const webhook = await msg.channel.createWebhook(`${msg.author.username}'s dad`, {avatar: image64});

    return webhook;
}
/**
 * @function
 * @param {Message} msg 
 * @returns 
 */
async function dad(msg) {
    if (msg.member.roles.cache.has(roleId)) {return;}

    const dadmatch = msg.content.match(/^(i\W*m|i\s+am)\s+(.*)/i);

    if (!dadmatch) {return;}
    
    const name = dadmatch[2];

    let output;
    if (name.match(/^\W*dad\W*$/i)){
        output = `No, you're not. You're ${msg.author.username}!`
    }
    else {
        output = `Hi, ${name}! I'm dad.`;
    }

    const webhook = await getDadHook(msg);
    await webhook.send(output);
    await webhook.delete();
}

module.exports = {run: dad, hook: getDadHook};