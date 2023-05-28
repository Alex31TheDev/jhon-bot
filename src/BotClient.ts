import { Bot, BotEvents, createBot } from "mineflayer";

import { Config, configDefaults } from "./config/Config";
import Auth from "./config/Auth";

import createLogger from "./logger/createLogger";

import IBotEvent from "./events/IBotEvent";
import IManager from "./managers/IManager";

import EventList from "./events";
import ManagersList from "./managers";

export default class BotClient {
    // dc erau private, dale drq sa poate sa fie folosite de eventuri/comenzi
    public config;
    public auth;
    
    public bot!: Bot;
    public logger;

    public connected = false;
    public spawned = false;
    public loggedIn = false;

    private events = new Map<string, IBotEvent>();
    private managers = new Map<string, IManager>();

    constructor(config: Config, auth: Auth) {
        this.config = {
            ...configDefaults,
            ...config
        };
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
                } else if(!this.connected) {
                    clearTimeout(timeout);
                    reject("Bot was disconnected.");
                }
            }, 100);
        });
    }

    waitForLogin() {
        return new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject("Bot didn't login in time."), 60000);

            setInterval(() => {
                if(this.loggedIn) {
                    clearTimeout(timeout);
                    resolve();
                } else if(!this.connected) {
                    clearTimeout(timeout);
                    reject("Bot was disconnected.");
                }
            }, 100);
        });
    }

    sendLogin() {
        this.bot.chat(`/login ${this.auth.password}`);
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
    
                this.events.set(event.name, event);
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
        this.connected = true;

        this.logger.info("Loading events...");
        this.loadEvents();

        this.logger.info("Loading managers...");
        await this.loadManagers();

        this.logger.info("Bot started.");
        this.logger.info("Sending login...");
        await this.waitForSpawn();
        this.sendLogin();

        await this.waitForLogin();
        this.logger.info("Successfully logged in.");
    }
}