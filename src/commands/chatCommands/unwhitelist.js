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
        if(args[1] == username) return say(`You can't unwhitelist yourself.`)
        if(whitelisted.whitelisted.includes(args[1])) {
            const index = jsonData.whitelisted.indexOf(args[1]);
            if (index !== -1) {
                jsonData.whitelisted.splice(index, 1);
                fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
            }
            say(`Removed ${args[1]} from whitelisted.json`)
        } else {
            say(`${args[1]} is not whitelisted.`)
        }
    }
}