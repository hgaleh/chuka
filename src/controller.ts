import express from 'express';
import core from 'express-serve-static-core';
import http from 'http';
import { injectable } from 'inversify';

export const getRouterSymbol = Symbol();
export const setControllerSymbol = Symbol();

interface Middleware<T> {
    (req: OverridePartial<http.IncomingMessage, T>, res: http.ServerResponse, next: core.NextFunction): void;
}

@injectable()
export abstract class Controller<T> {
    private router: express.Router;

    constructor(...middlewares: Array<Middleware<T>>) {
        this.router = express.Router();
        const routerImp = this.router as any;

        if (middlewares.length > 0) {
            routerImp.use.apply(routerImp, middlewares);
        }
    }

    private [setControllerSymbol](path: string, subrouter: Controller<unknown>): void {
        this.router.use(path, subrouter[getRouterSymbol]());
    }

    private [getRouterSymbol](): express.Router {
        return this.router;
    }

    protected get(path: string, handler: RequestHandler<T>) {
        this.router.get(path, (req, res) => {
            handler(req as any, res);
        })
    }

    protected methodMiddleware(path: string, ...middlewares: Array<Middleware<T>>): MiniController<T> {    
        return new MiniController(this.router, path, middlewares);
    }
}

class MiniController<T> {
    constructor(
        private router: any,
        private path: string,
        private middlewares: any[]
    ) {}

    get(handler: RequestHandler<T>): void {
        this.router.get.apply(this.router, [
            this.path,
            ...this.middlewares,
            (req: any, res: any) => {
                handler(req, res);
            }
        ]);
    }
}

interface RequestHandler<
    T
> {
    (
        req: Override<core.Request, T>,
        res: core.Response
    ): void;
}

type OverridePartial<A, B> = Omit<A, keyof B> & Partial<B>;
type Override<A, B> = Omit<A, keyof B> & B;
