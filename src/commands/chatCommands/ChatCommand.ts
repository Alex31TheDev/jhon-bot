import BotClient from "../../BotClient";
import BaseCommand from "../BaseCommand";

export default class ChatCommand extends BaseCommand {
    async execute(client: BotClient, args: string, username: string) {
        if(this.wlonly && !client.managers.PermissionManager.isWhitelisted(username)) {
            client.say("Access denied.");
            return;
        }

        return super.execute(client, args, username);
    }
}