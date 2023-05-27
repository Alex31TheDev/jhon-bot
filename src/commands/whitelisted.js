const whitelisted = require("../whitelisted.json")
const fs = require("fs")
const path = require("path")

const filePath = path.join(__dirname, '..', 'whitelisted.json');
const fileData = fs.readFileSync(filePath, 'utf8');
const jsonData = JSON.parse(fileData);

module.exports = {
    wlonly: true,
    execute(bot, username, args, say) {
        say(jsonData.whitelisted);
    }
}