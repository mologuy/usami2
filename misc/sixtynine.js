async function sixnine(msg) {
    var content = msg.content.replace(/<[@#][!&]?\d+>/i," "); //Remove mentions
    content = content.replace(/\bhttps?:\/\/\S+\b/i," "); //Remove links

    if (!content.match(/69/i)) { return; }

    //console.log("69 match:", content);

    await msg.reply({ content: "Nice", allowedMentions: { repliedUser: false }});
}

module.exports = {run: sixnine};