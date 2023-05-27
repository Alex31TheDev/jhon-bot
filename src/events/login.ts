import BotClient from "../BotClient";
import IBotEvent from "./IBotEvent";

export default class login implements IBotEvent {
    public name = "login";
    
    handler(client: BotClient) {
        client.logger.info("Bot connected.");
        client.connected = true;
    }
}