import BotClient from "../../BotClient";
import BaseCommand from "../BaseCommand";

export default class psay extends BaseCommand {
    public name = "psay";

    public handler(client: BotClient, args: string) {
        if(args.length < 1) {
            return this.say("[SYNTAX] psay [string]");
        }

        this.say(args);
    }
}