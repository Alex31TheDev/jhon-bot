const config = require("../config.json")
const Item = require('prismarine-item')('1.12.2')
const minecraftData = require('minecraft-data')('1.12.2');
var giving = false;

module.exports = {
    wlonly: true,
    execute(bot, username, args, say, print) {
        if(giving == true) return say("Im already doing a request.")
        if(args.length < 2) return say(`[SYNTAX] give [block_name]`)
        bot.chat(`/tpa ${username}`)
        giving = true;


        if(minecraftData.blocksByName[args[1]]) {
            bot.chat("/clear")
            bot.creative.setInventorySlot(36, new Item(minecraftData.blocksByName[args[1]].id, 1))
        }

        bot.on("messagestr", (msg) => {
            if(msg == `Error: You have already sent ${username} a teleport request.`) {
                bot.chat("/tpacancel")
                bot.chat(`/tpa ${username}`)
            }
            if (msg === `Teleporting to ${username}.`) {
                bot.chat("/tpacancel")
                bot.setQuickBarSlot(0);
                
                setTimeout(() => {
                    bot.toss(1,null,1)
                    bot.chat('/spawn')
                    giving = false;
                }, 1500);
            }
        })
        
    }
}

import BotClient from "../../BotClient";
import BaseCommand from "../BaseCommand";

export default class psay extends BaseCommand {
    public name = "give";

    public handler(client: BotClient, args: string, username: string) {
        if(args.length < 1) {
            return this.say("[SYNTAX] psay [string]");
        }

        this.say(args);
    }
}