import BotClient from "./BotClient";

import config from "../config/config.json";
import auth from "../config/auth.json";

const client = new BotClient(config, auth);
client.startBot();