import BotClient from "../BotClient";
import ICommand from "./ICommand";

import Util from "../Util";

abstract class BaseCommand implements ICommand {
    public abstract name: string;
    public abstract wlonly: boolean;

    public isSubcmd!: boolean;
    public enabled = true;

    public subcmds = new Map<string, BaseCommand>();
    public say!: (msg: string) => void;

    public parent?: string;
    public description?: string;
    public usage?: string;
    public aliases?: string[];
    public subcmdNames?: string[];

    private helpArgs = ["-h", "-help"];

    public async execute(client: BotClient, args: string, username: string): Promise<void> {
        if(!this.isSubcmd) {
            const [subName, subArgs] = Util.splitArgs(args),
                  subCmd = this.getSubcmd(subName);

            if(typeof subCmd !== "undefined") {
                return subCmd.execute(client, subArgs, username);
            }
        }

        if(this.helpArgs.includes(args.toLowerCase())) {
            client.say(this.getHelp());
            return;
        }

        return this.handler(client, args, username);
    }

    public handler(client: BotClient, ..._: unknown[]) {
        client.say("test command");
    }

    private getSubcmd(name: string) {
        if(this.subcmds.size < 1) {
            return;
        }

        return this.subcmds.get(name);
    }

    private getHelp() {
        let help = "";

        if(this.description) {
            help += `Description: ${this.description}`;

            if(this.usage) {
                help += ", ";
            }
        }

        if(this.usage) {
            help += `Usage: ${this.usage}`;
        }
        
        return help === "" ? "This command has no help." : help;
    }
}

export default class extends BaseCommand {
    name = "";
    wlonly = true;
}