import BotClient from "../../BotClient";
import BaseCommand from "../BaseCommand";

export default class help extends BaseCommand {
    public name = "help";

    public handler(client: BotClient) {
        const cmdNames = client.managers.CLIManager.commands.filter(x => !x.isSubcmd).map(x => {
            if(x.aliases) {
                return [x.name].concat(x.aliases).join("/");
            }

            return x.name;
        });

        this.say(`Commands: ${cmdNames.join(", ")}`);
    }
}