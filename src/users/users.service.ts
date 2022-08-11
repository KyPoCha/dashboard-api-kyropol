import {IUserService} from "./users.service.interface";
import {UserRegisterDto} from "./data-transfer-objects/user-register.dto";
import {UserLoginDto} from "./data-transfer-objects/user-login.dto";
import {User} from "./user-entity";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {IConfigService} from "../config/config.service.interface";
import {IUsersRepository} from "./users.repository.interface";
import { UserModel } from "@prisma/client";

@injectable()
export class UsersService implements IUserService{
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.UsersRepository) private usersRepository: IUsersRepository) {
    }

    async createUser({email,name,password}: UserRegisterDto): Promise<UserModel | null>{
        const newUser = new User(email,name);
        const salt = this.configService.get("SALT");
        //console.log(salt);
        await newUser.setPassword(password,Number(salt));
        const existedUser = await this.usersRepository.find(email);
        if(existedUser){
            return null;
        }
        return this.usersRepository.create(newUser);
    }

    async validateUser({email,password}: UserLoginDto): Promise<boolean>{
        const existedUser = await this.usersRepository.find(email);
        if(!existedUser){
            return false;
        }
        const newUser = new User(existedUser.email, existedUser.name,existedUser.password);
        return newUser.comparePassword(password);
    }
}