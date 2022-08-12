import "reflect-metadata";
import {Container} from "inversify";
import {IConfigService} from "../config/config.service.interface";
import {IUsersRepository} from "./users.repository.interface";
import {IUserService} from "./users.service.interface";
import {TYPES} from "../types";
import {UsersService} from "./users.service";
import { User } from "./user-entity";
import { UserModel } from "@prisma/client";

const ConfigServiceMock: IConfigService = {
    get: jest.fn(),
}

const UsersRepositoryMock: IUsersRepository = {
    find: jest.fn(),
    create: jest.fn(),
}

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;
let createdUser: UserModel | null;

beforeAll(()=>{
    container.bind<IUserService>(TYPES.UsersService).to(UsersService);
    container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
    container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

    configService = container.get<IConfigService>(TYPES.ConfigService);
    usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
    usersService = container.get<IUserService>(TYPES.UsersService);
});

describe("User Service", ()=>{
    it("createUser", async ()=>{
        configService.get = jest.fn().mockReturnValueOnce('1');
        usersRepository.create = jest.fn().mockImplementationOnce(
            (user: User): UserModel=>({
                name: user.name,
                email: user.email,
                password: user.password,
                id: 1,
            }),
        );
        createdUser = await usersService.createUser({
            email: 'a@a.com',
            name: 'Petr',
            password: '1',
        });
        expect(createdUser?.id).toEqual(1);
        expect(createdUser?.password).not.toEqual('1');
    });

    it("validateUser - success",async ()=>{
        usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
        const result = await usersService.validateUser({
            email: 'a@a.com',
            password: '1',
        });
        expect(result).toBeTruthy();
    });

    it("validateUser - wrong password",async ()=>{
        usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
        const result = await usersService.validateUser({
            email: 'a@a.com',
            password: '2',
        });
        expect(result).toBeFalsy();
    });


    it("validateUser - wrong user",async ()=>{
        usersRepository.find = jest.fn().mockReturnValueOnce(null);
        const result = await usersService.validateUser({
            email: 'a@a.com',
            password: '1',
        });
        expect(result).toBeFalsy();
    });
});

//afterAll();