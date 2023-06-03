import BotClient from "../BotClient";
import IHandler from "./IHandler";

export default class MessageHandler implements IHandler {
    private client;

    public 

    constructor(client: BotClient) {
        this.client = client;
    }

    onEvent(...args: any): void {
        throw new Error("Method not implemented.");
    }
}