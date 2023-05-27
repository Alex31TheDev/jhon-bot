const whitelisted = require("../whitelisted.json")
const fs = require("fs")
const path = require("path")

const filePath = path.join(__dirname, '..', 'whitelisted.json');
const fileData = fs.readFileSync(filePath, 'utf8');
const jsonData = JSON.parse(fileData);

module.exports = {
    wlonly: true,
    execute(bot, username, args, say) {
        if(args.length < 2) return say(`[SYNTAX] unwhitelist [username]`)
        if(!whitelisted.whitelisted.includes(args[1])) {
            jsonData.whitelisted.push(args[1]);
            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
            say(`Added ${args[1]} to whitelisted.json`)
        } else {
            say(`${args[1]} is already whitelisted.`)
        }
    }
}