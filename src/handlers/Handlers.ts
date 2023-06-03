import BotClient from "../BotClient";

import MessageHandler from "./MessageHandler";

export default class Handlers {
    private client;

    public messageHandler;

    constructor(client: BotClient) {
        this.client = client;

        this.messageHandler = new MessageHandler(client);
    }

    public init() {
        for(const [_, value] of Object.entries(this)) {
            if("init" in value) {
                value.init();
                this.client.logger.info("Loaded " + value.constructor.name);
            }
        }
    }
}