import {IUserService} from "./users.service.interface";
import {UserRegisterDto} from "./data-transfer-objects/user-register.dto";
import {UserLoginDto} from "./data-transfer-objects/user-login.dto";
import {User} from "./user-entity";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {IConfigService} from "../config/config.service.interface";

@injectable()
export class UsersService implements IUserService{
    constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {
    }
    async createUser({email,name,password}: UserRegisterDto): Promise<User | null>{
        const newUser = new User(email,name);
        const salt = this.configService.get("SALT");
        //console.log(salt);
        await newUser.setPassword(password,Number(salt));
        //check for validation?
        // if exists - return null
        // if doesn`t - create
        return null;
    }

    async validateUser({}: UserLoginDto): Promise<boolean>{
        return true;
    }
}