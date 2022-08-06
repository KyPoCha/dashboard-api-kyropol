import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { Container, ContainerModule, interfaces } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exception.filter.interface';
import 'reflect-metadata';

//async function bootstrap(){
/*const logger = new LoggerService();
    const app = new App(
        logger,
        new UsersController(logger),
        new ExceptionFilter(logger)
    );
    */

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<UsersController>(TYPES.UsersController).to(UsersController);
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();

/*
    const appContainer = new Container();
    appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
    appContainer.bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
    appContainer.bind<UsersController>(TYPES.UsersController).to(UsersController);
    appContainer.bind<App>(TYPES.Application).to(App);

    const app = appContainer.get<App>(TYPES.Application);

    //await app.init();
    app.init();
    export {app,appContainer};
//}
*/
//bootstrap();
