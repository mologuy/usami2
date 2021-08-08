const data = {
    name: "addone",
    description: "adds one to an integer",
    options: [{
        name: "number",
        type: "INTEGER",
        required: true,
        description: "the number to add one to"
    }]
}

async function run(interaction) {
    var num = interaction.options.getInteger("number");
    num++;
    interaction.reply(num.toString());
}

module.exports = {data, run};