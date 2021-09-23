(async()=>{
    const rcon = require("./minecraft-controller").rcon;
    const output = await rcon("list");
    console.log(output);
})()