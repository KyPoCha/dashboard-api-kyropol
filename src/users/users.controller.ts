import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';
import { IUsersController } from './users.controller.interface';
import { UserLoginDto } from "./data-transfer-objects/user-login.dto";
import { UserRegisterDto } from "./data-transfer-objects/user-register.dto";
import { UsersService } from "./users.service";
import { ValidateMiddleware } from "../common/validate.middleware";
import { sign } from "jsonwebtoken";
import {ConfigService} from "../config/config.service";
import { IConfigService } from '../config/config.service.interface';
import { IUserService } from './users.service.interface';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UsersService) private usersService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)]
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [],
			},
		]);
	}

	async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.usersService.validateUser(req.body);
		if(!result){
			return next(new HTTPError(401,'error of authorization', 'login'));
		}
		const jwt = await this.signJWT(req.body.email, this.configService.get("SECRET"));
		this.ok(res, { jwt });
	}

	async register({body}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.usersService.createUser(body);
		if(!result){
			return next(new HTTPError(422, "This user already exists!"));
		}
		this.ok(res, { email: result.email, id: result.id });
	}

	async info({user}: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, { email: user});
	}

	private signJWT(email: string, secret: string): Promise<string>{
		return new Promise<string>((resolve, reject)=>{
			sign({
				email,
				iat: Math.floor(Date.now() / 1000),
			}, secret,{
				algorithm: "HS256"
			}, (err, token)=>{
				if(err){
					reject(err);
				}
				resolve(token as string);
			})
		});
	}
}
