import BotClient from "../BotClient";

import CLIManager from "./CLIManager";
import CommandManager from "./CommandManager";
import PermissionManager from "./PermissionManager";

export default class Managers {
    private client;

    public CLIManager!: CLIManager;
    public CommandManager!: CommandManager;
    public PermissionManager;

    constructor(client: BotClient) {
        this.client = client;

        if(client.config.enableCLICommands) {
            this.CLIManager = new CLIManager(client);
        }

        if(client.config.enableChatCommands) {
            this.CommandManager = new CommandManager(client);
        }
        
        this.PermissionManager = new PermissionManager(client);
    }

    public async init() {
        for(const [_, value] of Object.entries(this)) {
            if("init" in value) {
                await value.init();
                this.client.logger.info("Loaded " + value.constructor.name);
            }
        }
    }
}