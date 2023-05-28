import BotClient from "./BotClient";

import config from "../config/config.json";
import auth from "../config/auth.json";

(async () => {
    const client = new BotClient(config, auth);
    await client.startBot();
    await client.joinSection();
})();