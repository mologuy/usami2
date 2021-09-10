(async()=>{
    const rcon = require("./minecraft-controller").rcon;
    const output = await rcon("time query gametime");
    console.log(output);
})()