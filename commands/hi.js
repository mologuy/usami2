const data = {
    name: "hi",
    description: "Says hi after a delay",
    options: [{
        type: "INTEGER",
        required: false,
        name: "miliseconds",
        description: "the amount of miliseconds to wait before responding [0 - 800000]"
    }]
}

const sleep = function(ms){
    return new Promise((resolve, reject)=>{
        try {
            setTimeout(resolve, ms);
        }
        catch(e) {
            reject();
        }
    });
}

async function run(interaction) {
    await interaction.deferReply();
    var ms = interaction.options?.getInteger("miliseconds");
    if (ms) {
        ms = Math.max(0, Math.min(ms, 800000));
    }
    else {
        ms = 0;
    }
    await sleep(ms);
    await interaction.editReply("Hi!");
}

module.exports = {data, run};