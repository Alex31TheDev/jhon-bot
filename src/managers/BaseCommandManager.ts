import BotClient from "../BotClient";
import Util from "../Util";
import BaseCommand from "../commands/BaseCommand";
import IManager from "./IManager";

type ParsedMsg = {
    username: string,
    content: string
};

export default abstract class BaseCommandManager implements IManager {
    public commands = new Array<BaseCommand>;
    protected client;

    constructor(client: BotClient) {
        this.client = client;
    }

    public init() {
        return;
    }

    public async executeCmd(msg: string) {
        const { username, content } = this.parseMsg(msg);

        if(!this.isCmd(content)) {
            return false;
        }

        const [cmdName, args] = Util.splitArgs(content.slice(this.cmdPrefix.length)),
              cmd = this.searchCmds(cmdName);

        if(typeof cmd === "undefined") {
            this.say(`Command "${cmdName}" doesn't exist.`);
            return true;
        }
        
        try {
            await cmd.execute(this.client, args, username);
        } catch(err) {
            this.say("Command execution failed: " + err.message);
            this.client.logger.error("Command execution failed", err);

            return true;
        }

        return true;
    }

    protected abstract cmdPrefix: string;
    protected abstract parseMsg(msg: string): ParsedMsg;
    protected abstract say(msg: string): void;

    protected loadCommands(CommandList: typeof BaseCommand[]) {
        let ok = 0, bad = 0;

        for(const commandClass of CommandList) {
            try {
                const command: BaseCommand = new commandClass();

                if(command.enabled) {
                    command.say = this.say.bind(this);

                    this.commands.push(command);
                    ok++;
                } else {
                    this.client.logger.info(`Not loading command ${command.name}, disabled.`);
                }
            } catch(err) {
                this.client.logger.error("Failed to load event.", err);
                bad++;
            }
        }

        this.client.logger.info(`Loaded ${ok + bad} commands. ${ok} successful, ${bad} failed.`);
        this.loadSubcommands();
    }

    private loadSubcommands() {
        this.commands.forEach(x => {
            if(x.isSubcmd || x.subcmdNames.length < 1) {
                return;
            }

            x.subcmdNames.forEach(n => {
                const find = this.commands.find(y => {
                    return y.name === n && y.parent === x.name;
                });

                if(typeof find === "undefined") {
                    this.client.logger.error(`Subcommand "${n}" of command "${x.name}" not found.`);
                    return;
                }

                x.subcmds.set(find.name, find);
            });
        });
    }

    private isCmd(str: string) {
        return str.startsWith(this.cmdPrefix);
    }

    private searchCmds(name: string) {
        return this.commands.find(x => {
            if(x.aliases.length > 0) {
                return (x.name === name || x.aliases.includes(name)) && !x.isSubcmd;
            }
            
            return x.name === name && !x.isSubcmd;
        });
    }
}