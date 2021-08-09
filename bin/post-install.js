const fs = require("fs");
const path = require("path");
const DEFAULTS = require("./defaults.json");

const FILENAME = DEFAULTS.options_filename;
const FILEPATH = path.join(__dirname,"..", FILENAME);

console.log("Starting post install script");


if (fs.existsSync(FILEPATH)) {
    console.log(FILENAME, "exists");
    var curroptions = require(FILEPATH);
    for (var property in DEFAULTS) {
        if (!curroptions[property]) {
            curroptions[property] = DEFAULTS[property];
        }
    }
    fs.writeFileSync(FILEPATH,JSON.stringify(curroptions,{},4));
}
else {
    console.log(FILENAME, "doesn't exist");
    console.log("Loading defaults...");

    fs.writeFileSync(FILEPATH,JSON.stringify(DEFAULTS,{},4));
}

console.log("Ending post install script");