import { Bot, BotEvents, createBot } from "mineflayer";

import IConfig from "./config/IConfig";
import IAuth from "./config/IAuth";

import createLogger from "./logger/createLogger";

import IBotEvent from "./events/IBotEvent";
import IManager from "./managers/IManager";

import EventList from "./events";
import ManagersList from "./managers";

export default class BotClient {
    private config;
    private auth;

    private events = new Map<string, IBotEvent>();
    private managers = new Map<string, IManager>();
    
    public bot!: Bot;
    public logger;

    public connected = false;
    public spawned = false;

    constructor(config: IConfig, auth: IAuth) {
        this.config = config;
        this.auth = auth;

        this.logger = createLogger({
            name: "Jhon bot",
            filename: config.logFile,
            console: true,
            fileFormat: [
                {
                    name: "timestamp",
                    prop: {
                        format: "YYYY-MM-DD HH:mm:ss",
                    },
                },
                {
                    name: "errors",
                    prop: {
                        stack: true,
                    },
                },
                "json",
            ],
            consoleFormat: [
                {
                    name: "timestamp",
                    prop: {
                        format: "YYYY-MM-DD HH:mm:ss",
                    },
                },
                {
                    name: "printf",
                    prop: ({ level, message, timestamp, stack }:
                           { level: string, message: string, timestamp: string, stack: object}) =>
                        `[${timestamp}] - ${level}: ${message}  ${level == "error" ? stack : ""}`,
                },
                "colorize",
            ],
        });
    }

    waitForSpawn() {
        return new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject("Bot didn't spawn in time."), 60000);

            setInterval(() => {
                if(this.spawned) {
                    clearTimeout(timeout);
                    resolve();
                }
            }, 100);
        });
    }

    loadEvents() {
        let ok = 0, bad = 0;

        for(const eventClass of EventList) {
            try {
                const event: IBotEvent = new eventClass(),
                      handler = event.handler.bind(undefined, this);
    
                if(event.once ?? false) {
                    this.bot.once(event.name as keyof BotEvents, handler);
                } else {
                    this.bot.on(event.name as keyof BotEvents, handler);
                }
    
                ok++;
            } catch(err) {
                this.logger.error("Failed to load event.", err);
                bad++;
            }
        }

        this.logger.info(`Loaded ${ok + bad} events. ${ok} successful, ${bad} failed.`);
    }

    async loadManagers() {
        return;
    }

    async startBot() {
        this.logger.info("Creating bot...");
        this.bot = createBot({
            host: this.config.server_ip,
            port: this.config.server_port,
            username: this.auth.username,
            version: this.config.version
        });

        this.logger.info("Loading events...");
        this.loadEvents();

        this.logger.info("Loading managers...");
        await this.loadManagers();

        this.logger.info("Bot started.");
    }
}