import express from 'express';
import core from 'express-serve-static-core';
import http from 'http';

const getRouterSymbol = Symbol();

export function createApp() {
    const app = express();

    return {
        setRouter(path: string, router: GRouter<{}>): void {
            app.use(path, router[getRouterSymbol]());
        },

        listen(port: number, callback: any): void {
            app.listen(port, callback);
        }
    }
}

export function createRouter<T>(): GRouter<T>;
export function createRouter<T, A>(middleware0: Middleware<T, A>): GRouter<A>;
export function createRouter<T, A, B>(middleware0: Middleware<T, A>, middleware1: Middleware<A, B>): GRouter<B>;
export function createRouter(...middlewares: Array<any>) {
    const router = new GRouter();

    if (middlewares.length > 0) {
        router[getRouterSymbol]().use(...middlewares);
    }

    return router;
}

interface Middleware<A, B> {
    (req: Override<http.IncomingMessage, A>, res: http.ServerResponse, next: core.NextFunction): Override<A, B>
}

class GRouter<T> {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
    }

    setSubRouter(path: string, subrouter: GRouter<any>): void {
        this.router.use(path, subrouter[getRouterSymbol]());
    }

    private [getRouterSymbol](): express.Router {
        return this.router;
    }

    get(path: string, handler: RequestHandler<T>) {
        this.router.get(path, (req, res) => {
            handler(req as any, res);
        })
    }

    methodMiddleware<A>(path: string, middleware0: Middleware<T, A>): MiniRouter<A>;
    methodMiddleware<A, B>(path: string, middleware0: Middleware<T, A>, middleware1: Middleware<A, B>): MiniRouter<B>;
    methodMiddleware<A, B, C>(path: string, middleware0: Middleware<T, A>, middleware1: Middleware<A, B>, middleware2: Middleware<B, C>): MiniRouter<C>;
    methodMiddleware(path: string, ...middlewares: Array<any>) {    
        return new MiniRouter(this.router, path, middlewares);
    }
}

class MiniRouter<T> {
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

type Override<A, B> = Omit<A, keyof B> & B;
