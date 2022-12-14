import express, { Express } from 'express';
import { Server } from 'http';
//import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
//import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import {json} from "body-parser";
//import {ConfigService} from "./config/config.service";
import {IUsersController} from "./users/users.controller.interface";
import {IConfigService} from "./config/config.service.interface";
import {IExceptionFilter} from "./errors/exception.filter.interface";
import {PrismaService} from "./database/prisma.service";
import {AuthMiddleware} from "./common/auth.middleware";

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;
	//logger: ILogger;
	//userController: UsersController;
	//exceptionFilter: ExceptionFilter;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UsersController) private userController: UsersController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService
	) {
		this.app = express();
		this.port = 8000;
		//this.logger = logger;
		//this.userController = userController;
		//this.exceptionFilter = exceptionFilter;
	}

	public useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	public useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get("SECRET"));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	public useExceptionsFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionsFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server is loaded on http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
