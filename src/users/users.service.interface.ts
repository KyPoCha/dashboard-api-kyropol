import {UserRegisterDto} from "./data-transfer-objects/user-register.dto";
import {User} from "./user-entity";
import {UserLoginDto} from "./data-transfer-objects/user-login.dto";

export interface IUserService {
    createUser: (dto: UserRegisterDto)=> Promise<User | null>;
    validateUser: (dto: UserLoginDto)=> Promise<boolean>;
}