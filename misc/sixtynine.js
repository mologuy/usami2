async function sixnine(msg) {
    var content = msg.content.replace(/<\S+\d{18,}>/i," "); //Remove mentions
    content = content.replace(/\bhttps?:\/\/\S+\b/i," "); //Remove links

    if (!content.match(/69/i)) { return; }

    await msg.reply({ content: "Nice", allowedMentions: { repliedUser: false }});
}

module.exports = {run: sixnine};