type Config = {
    server_ip: string,
    server_port: number,
    version: string,
    prefix: string,
    settings: {
        toggletpa: boolean
    },
    logFile: string,
    consoleIsChat: boolean
};

const configDefaults = {
    server_port: 25565,
    version: "1.12.2",
    prefix: "!"
};

export { Config, configDefaults };