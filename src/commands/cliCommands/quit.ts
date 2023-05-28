import BotClient from "../../BotClient";
import BaseCommand from "../BaseCommand";

export default class quit extends BaseCommand {
    public name = "quit";
    public aliases = ["q"];

    public handler(client: BotClient) {
        client.quit();
    }
}