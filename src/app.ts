import express, { Express } from 'express';
import { Server } from 'http';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';

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
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
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

	public useExceptionsFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useRoutes();
		this.useExceptionsFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server is loaded on http://localhost:${this.port}`);
	}
}
