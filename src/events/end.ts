import BotClient from "../BotClient";
import IBotEvent from "./IBotEvent";

export default class end implements IBotEvent {
    public name = "end";
    
    handler(client: BotClient, reason: string) {
        client.logger.info("Session ended with reason: " + reason);
        client.connected = false;
    }
}