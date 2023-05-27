import winston from "winston";
import path from "path";

import LoggerError from "./LoggerError";
import { ILoggerConfig, ConfigFormat } from "./LoggerConfig";

const validForm = Object.getOwnPropertyNames(winston.format).filter(x =>
    !(["length", "combine"].includes(x))
);

function getFormat(names: ConfigFormat) {
    if(typeof names === "undefined") {
        return winston.format.simple();
    } else if(typeof names === "string") {
        names = [names];
    }
    
    const formats = names.map(x => {
        let name: string, prop;
        
        if(typeof x === "object") {
            ({
                "name": name,
                "prop": prop
            } = x);
        } else {
            name = x;
        }
        
        if(!validForm.includes(name)) {
            throw new LoggerError("Invalid format: " + x);
        }
        
        return winston.format[name as keyof typeof winston.format](prop);
    });
    
    return winston.format.combine(...formats);
}

function getFilename(name: string) {
    const file = path.basename(name),
          dir = path.dirname(name),
          date = new Date().toISOString().substring(0,10);

    return path.join(dir, date + "-" + file);
}

function addConsole(logger: winston.Logger, format:winston.Logform.Format) {
    logger.add(new winston.transports.Console({
        format: format
    }));
}

function createLogger(config: ILoggerConfig) {
    const file = new winston.transports.File({
        filename: getFilename(config.filename),
        format: getFormat(config.fileFormat)
    });
    
    let meta;
    
    if(typeof config.name !== "undefined") {
        meta = {
            service: config.name
        };
    }
    
    const logger = winston.createLogger({
        level: config.level ?? "debug",
        transports: [
            file
        ],
        defaultMeta: meta
    });

    if(config.console && typeof config.consoleFormat !== "undefined") {
        addConsole(logger, getFormat(config.consoleFormat));
    }
    
    return logger;
}

export default createLogger;