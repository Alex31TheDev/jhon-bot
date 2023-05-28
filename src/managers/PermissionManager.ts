import BotClient from "../BotClient";
import IManager from "./IManager";

import whitelist from "../../config/whitelisted.json";

export default class PermissionManager implements IManager {
    private client;

    constructor(client: BotClient) {
        this.client = client;
    }

    public init() {
        return;
    }

    public isWhitelisted(username: string) {
        return whitelist.whitelisted.includes(username);
    }
}