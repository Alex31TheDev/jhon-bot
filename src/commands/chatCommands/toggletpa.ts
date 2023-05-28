import BotClient from "../../BotClient";
import BaseCommand from "../BaseCommand";

export default class toggletpa extends BaseCommand {
    public name = "toggletpa";

    public handler(client: BotClient) {
        if(client.config.toggleTpa === false) {
            client.config.toggleTpa = true;
            this.say("[TOGGLE-TPA] Enabled");
        } else {
            client.config.toggleTpa = false;
            this.say("[TOGGLE-TPA] Disabled");
        }
    }
}