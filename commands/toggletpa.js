const config = require("../config.json")

module.exports = {
    wlonly: true,
    execute(bot, username, args, say) {
        if(config.settings.toggletpa == false) {
            config.settings.toggletpa = true;
            say("[TOGGLE-TPA] Enabled")
        } else {
            config.settings.toggletpa = false;
            say("[TOGGLE-TPA] Disabled")
        }
    }
}