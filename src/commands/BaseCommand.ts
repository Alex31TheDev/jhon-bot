import BotClient from "../BotClient";
import ICommand from "./ICommand";

import Util from "../Util";

export default class BaseCommand implements ICommand {
    public name = "base";
    public enabled = true;
    public wlonly = true;

    public description = "";
    public usage = "";

    public isSubcmd = false;
    public parent = "";
    public aliases: string[] = [];
    public subcmdNames: string[] = [];

    public subcmds = new Map<string, BaseCommand>();
    public say!: (msg: string) => void;

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

        if(this.description.length > 0) {
            help += `Description: ${this.description}`;

            if(this.usage.length > 0) {
                help += ", ";
            }
        }

        if(this.usage.length > 0) {
            help += `Usage: ${this.usage}`;
        }
        
        return help === "" ? "This command has no help." : help;
    }
}