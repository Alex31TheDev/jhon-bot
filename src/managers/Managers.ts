import BotClient from "../BotClient";

import CLIManager from "./CLIManager";
import CommandManager from "./CommandManager";
import PermissionManager from "./PermissionManager";

export default class Managers {
    private client;

    public CLIManager;
    public CommandManager;
    public PermissionManager;

    constructor(client: BotClient) {
        this.client = client;

        this.CLIManager = new CLIManager(client);
        this.CommandManager = new CommandManager(client);
        this.PermissionManager = new PermissionManager(client);
    }

    public async init() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for(const [_, value] of Object.entries(this)) {
            if("init" in value) {
                await value.init();
                this.client.logger.info("Loaded " + value.constructor.name);
            }
        }
    }
}