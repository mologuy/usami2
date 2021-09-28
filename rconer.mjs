import {rcon} from "./minecraft-controller.js"

async function main() {
    const command = process.argv.splice(2)?.join(" ");
    if (command && command.match(/\S/g)) {
        const output = await rcon(command);
        console.log(output);
        process.exit(0);
    }
    else {
        console.error("Invalid argument(s)");
        process.exit(1);
    }
}
main();