async function sixnine(msg) {
    const match69 = msg.content.match(/69/i);
    if (!match69) { return; }

    await msg.reply({ content: "Nice", allowedMentions: { repliedUser: false }});
}

module.exports = {run: sixnine};