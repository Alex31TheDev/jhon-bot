import { Bot, BotEvents, createBot } from "mineflayer";

import { Config, configDefaults } from "./config/Config";
import Auth from "./config/Auth";

import Util from "./Util";
import createLogger from "./logger/createLogger";

import IBotEvent from "./events/IBotEvent";
import EventList from "./events";
import Managers from "./managers/Managers";
import Handlers from "./handlers/Handlers";

export default class BotClient {
    // dc erau private, dale drq sa poate sa fie folosite de eventuri/comenzi
    public config;
    public auth;
    
    public bot!: Bot;
    public managers!: Managers;
    public handlers!: Handlers;

    public logger;
    public events = new Map<string, IBotEvent>();

    public connected = false;
    public spawned = false;
    public loggedIn = false;

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

    public say(msg: string, padding = true) {
        if(padding) {
            const alphabet = "abcdefghijklmnopqrstuvwxyz",
            antiSpam = Array(4).fill(0).map(() => alphabet[~~(Math.random() * alphabet.length)]).join("");

            this.bot.chat(`${msg} [${antiSpam}]`);
        } else {
            this.bot.chat(msg);
        }
    }

    public async startBot() {
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
        this.managers = new Managers(this);
        await this.managers.init();

        this.logger.info("Loading handlers...");
        this.handlers = new Handlers(this);
        this.handlers.init();

        this.logger.info("Bot started.");
        await this.waitForSpawn();
        this.logger.info("Sending login...");
        this.sendLogin();

        await this.waitForLogin();
        this.logger.info("Successfully logged in.");
    }

    public async joinSection() {
        this.logger.info("Joining section...");
        this.bot.setQuickBarSlot(0);
        this.bot.activateItem();

        await Util.delay(300);
        this.bot.clickWindow(18, 0, 0);

        await this.waitForSpawn();
        this.logger.info("Successfully joined section.");
    }

    public quit() {
        this.logger.info("Disconnecting bot...");
        this.bot.quit();
        process.exit(0);
    }
    
    private waitForSpawn() {
        return new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject("Bot didn't spawn in time."), 60000),
                  interval = setInterval(() => {
                if(this.spawned) {
                    clearTimeout(timeout);
                    clearInterval(interval);

                    this.spawned = false;
                    resolve();
                } else if(!this.connected) {
                    clearTimeout(timeout);
                    clearInterval(interval);

                    reject("Bot was disconnected.");
                }
            }, 100);
        });
    }

    private waitForLogin() {
        return new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject("Bot didn't login in time."), 60000),
                  interval = setInterval(() => {
                if(this.loggedIn) {
                    clearTimeout(timeout);
                    clearInterval(interval);

                    resolve();
                } else if(!this.connected) {
                    clearTimeout(timeout);
                    clearInterval(interval);

                    reject("Bot was disconnected.");
                }
            }, 100);
        });
    }

    private loadEvents() {
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

    private sendLogin() {
        this.bot.chat(`/login ${this.auth.password}`);
    }
}