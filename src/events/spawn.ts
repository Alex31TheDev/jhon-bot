import BotClient from "../BotClient";
import IBotEvent from "./IBotEvent";

export default class spawn implements IBotEvent {
    public name = "spawn";
    
    handler(client: BotClient) {
        client.logger.info("Bot spawned.");
        
        if(client.spawned) {
            client.joined = true;
        } else {
            client.spawned = true;
        }
    }
}