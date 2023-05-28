import BotClient from "../BotClient";
import IBotEvent from "./IBotEvent";

export default class spawn implements IBotEvent {
    public name = "spawn";
    
    public handler(client: BotClient) {
        client.logger.info("Bot spawned.");
        client.spawned = true;
    }
}