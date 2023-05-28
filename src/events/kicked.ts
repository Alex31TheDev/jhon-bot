import BotClient from "../BotClient";
import IBotEvent from "./IBotEvent";

export default class kicked implements IBotEvent {
    public name = "kicked";
    
    public handler(client: BotClient, reason: string) {
        client.logger.info("Bot was kicked with reason: " + reason);

        client.connected = false;
        client.loggedIn = false;
    }
}