export default interface IConfig {
    server_ip: string,
    server_port: number,
    version: string,
    prefix: string,
    settings: {
        toggletpa: boolean
    },
    logFile: string
}