const fs = require("fs");
const path = require("path");

const FILENAME = "options.json";
const FILEPATH = path.join(__dirname,"..", FILENAME);

console.log("Starting post install script");

if (fs.existsSync(FILEPATH)) {
    console.log(FILENAME, "exists");
}
else {
    console.log(FILENAME, "doesn't exist");
    console.log("Loading defaults...");

    const DEFAULTS = {
        token: "123456abcdef",
        version: "2.0"
    };

    fs.writeFileSync(FILEPATH,JSON.stringify(DEFAULTS,{},4));
}

console.log("Ending post install script");