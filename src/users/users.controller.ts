import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';
import { IUsersController } from './users.controller.interface';
import {UserLoginDto} from "./data-transfer-objects/user-login.dto";
import {UserRegisterDto} from "./data-transfer-objects/user-register.dto";
import {User} from "./user-entity";
import {UsersService} from "./users.service";
import {ValidateMiddleware} from "../common/validate.middleware";

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UsersService) private usersService: UsersService
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
		]);
	}

	async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.usersService.validateUser(req.body);
		if(!result){
			return next(new HTTPError(401,'error of authorization', 'login'));
		}
		this.ok(res, { });
	}

	async register({body}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.usersService.createUser(body);
		if(!result){
			return next(new HTTPError(422, "This user already exists!"));
		}
		this.ok(res, { email: result.email, id: result.id });
	}
}
