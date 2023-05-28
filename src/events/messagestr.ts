import BotClient from "../BotClient";
import IBotEvent from "./IBotEvent";

export default class messagestr implements IBotEvent {
    public name = "messagestr";
    
    handler(client: BotClient, message: string) {
        // DE FACUT LISTENER LA CONSOLE INPUT SA POTI TRIMITE MESAJE DIN CONSOLA
        if(client.config.consoleIsChat) {
            client.logger.info(message);
        }

        if(message.startsWith("Gamster ▸ You have been logged in!")) {
            client.loggedIn = true;
            return;
        }

        
    }
}