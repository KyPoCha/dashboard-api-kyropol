import { NextFunction, Request, Response } from 'express';

export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: 'get' | 'post' | 'delete' | 'patch' | 'put';
}

export type ExpressReturnType = Response<any, Record<string, any>>;
