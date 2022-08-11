import {UserRegisterDto} from "./data-transfer-objects/user-register.dto";
import {UserLoginDto} from "./data-transfer-objects/user-login.dto";
import { UserModel } from "@prisma/client";

export interface IUserService {
    createUser: (dto: UserRegisterDto)=> Promise<UserModel | null>;
    validateUser: (dto: UserLoginDto)=> Promise<boolean>;
    getUserInfo: (email: string) => Promise<UserModel | null>;
}