// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConfigFormat = string | string[] | Record<string, any>[] | (string | Record<string, any>)[];
type LoggerLevel = "error" | "warning" | "info" | "debug";

interface ILoggerConfig {
    name?: string,
    filename: string,
    fileFormat: ConfigFormat,
    consoleFormat?: ConfigFormat,
    console?: boolean,
    level?: LoggerLevel
}

export {ILoggerConfig, ConfigFormat};