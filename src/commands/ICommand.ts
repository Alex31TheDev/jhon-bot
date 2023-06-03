import BotClient from "../BotClient";

export default interface ICommand {
    name: string;
    isSubcmd: boolean;
    wlonly: boolean;
    enabled: boolean;
    
    parent?: string;
    description?: string;
    usage?: string;
    aliases?: string[];
    subcmdNames?: string[];

    handler(client: BotClient, args: string, username?: string): void;
}