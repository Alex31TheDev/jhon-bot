import readline from "readline/promises";

import CommandList from "../../commands/cliCommands";
import BaseCommandManager from "./BaseCommandManager";

export default class CLIManager extends BaseCommandManager {
    protected cmdPrefix = this.client.config.cliPrefix;
    private rl!: readline.Interface;

    public init() {
        this.loadCommands(CommandList);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.rl = rl;
        this.inputLoop();
    }

    protected say(msg: string) {
        this.client.logger.info(msg);
    }

    protected parseMsg(msg: string) {
        return {
            username: "",
            content: msg
        };
    }

    private async inputLoop() {
        while(true) {
            const input = await this.rl.question("");
            this.handleInput(input);
        }
    }

    private async handleInput(input: string) {
        if(this.client.config.enableCLICommands) {
            if(!await this.executeCmd(input)) {
                this.client.bot.chat(input);
            }
        } else {
            this.client.bot.chat(input);
        }
    }
}