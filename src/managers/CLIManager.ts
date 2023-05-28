import readline from "readline/promises";

import BotClient from "../BotClient";
import IManager from "./IManager";

export default class CLIManager implements IManager {
    private client;
    private rl!: readline.Interface;

    constructor(client: BotClient) {
        this.client = client;
    }

    init() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.rl = rl;
        this.inputLoop();
    }

    async inputLoop() {
        while(true) {
            const input = await this.rl.question("");
            this.handleInput(input);
        }
    }

    handleInput(input: string) {
        this.client.bot.chat(input);
    }
}