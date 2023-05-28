import { cli } from "winston/lib/winston/config";
import BotClient from "../BotClient";
import IBotEvent from "./IBotEvent";

export default class messagestr implements IBotEvent {
    public name = "messagestr";
    public once = true;
    
    handler(client: BotClient) {
        client.bot.on("messagestr", (message) => {

            // DE FACUT LISTENER LA CONSOLE INPUT SA POTI TRIMITE MESAJE DIN CONSOLA
            if(client.config.consoleischat) { client.logger.info(message) }

            // partea de login
            if(message.startsWith("Gamster ▸ Please login: /login <password>")) {
                setTimeout(() => {
                    if(client.spawned) {
                        client.bot.chat(`/login ${client.auth.password}`)
                    }
                }, 2000);
            } 

            if(message.startsWith("Gamster ▸ You have been logged in!")) {
                client.logger.info("Successfully Logged in.")
                client.loggedin = true;
            }

        });
    }
}