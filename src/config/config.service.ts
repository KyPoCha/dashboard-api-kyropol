import {IConfigService} from "./config.service.interface";
import {config, DotenvConfigOutput, DotenvParseOutput} from "dotenv";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {ILogger} from "../logger/logger.interface";

@injectable()
export class ConfigService implements IConfigService{
    private config: DotenvParseOutput;
    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        const result: DotenvConfigOutput = config();
        //console.log(result);
        if(result.error){
            this.logger.error("[ConfigService] Failed to read the .env file or this file is missing");
        }
        else {
            this.logger.log("[ConfigService] Loaded configuration .env");
            this.config = result.parsed as DotenvParseOutput;
        }
    }

    get(key: string): string{
        //console.log(this.config[key]);
        return this.config[key];
    }
}