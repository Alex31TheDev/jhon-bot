import CommandList from "../../commands/chatCommands";
import BaseCommandManager from "./BaseCommandManager";

const msgExp = /.+\s(\w+)\s?[›:].(.+)/;

export default class CommandManager extends BaseCommandManager {
    protected cmdPrefix = this.client.config.prefix;

    public init() {
        this.loadCommands(CommandList);
    }

    protected say(msg: string) {
        this.client.say(msg);
    }

    protected parseMsg(msg: string) {
        const match = msg.match(msgExp);

        if(match) {
            return {
                username: match[1],
                content: match[2]
            };
        }
        
        return {
            username: "",
            content: ""
        };
    }
}