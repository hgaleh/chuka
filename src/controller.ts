import express from 'express';
import core from 'express-serve-static-core';
import http from 'http';
import { injectable } from 'inversify';

export const getRouterSymbol = Symbol();
export const setControllerSymbol = Symbol();

export interface Middleware<T> {
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

    protected get<Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>) {
        this.router.get(path, (req, res) => {
            handler(req as any, res);
        })
    }

    protected post<Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>) {
        this.router.post(path, (req, res) => {
            handler(req as any, res);
        })
    }
    
    protected middleware<A, Path extends string = string>(path: Path, middleware0: Middleware<A>): MiniController<A, RouteParameters<Path>>;    
    protected middleware<A, B, Path extends string = string>(path: Path, middleware0: Middleware<A>, middleware1: Middleware<B>): MiniController<A & B, RouteParameters<Path>>;    
    protected middleware<A, B, C, Path extends string = string>(path: Path, middleware0: Middleware<A>, middleware1: Middleware<B>, middleware2: Middleware<C>): MiniController<A & B & C, RouteParameters<Path>>;    
    protected middleware<S, Path extends string = string>(path: Path, ...middlewares: Array<Middleware<S>>): MiniController<S, RouteParameters<Path>> {    
        return new MiniController(this.router, path, middlewares);
    }
}

class MiniController<T, P = ParamsDictionary> {
    constructor(
        private router: any,
        private path: string,
        private middlewares: any[]
    ) {}

    get(handler: RequestHandler<T, P>): void {
        this.router.get.apply(this.router, [
            this.path,
            ...this.middlewares,
            (req: any, res: any) => {
                handler(req, res);
            }
        ]);
    }

    post(handler: RequestHandler<T, P>): void {
        this.router.post.apply(this.router, [
            this.path,
            ...this.middlewares,
            (req: any, res: any) => {
                handler(req, res);
            }
        ]);
    }
}

interface RequestHandler<
    T,
    P = ParamsDictionary
> {
    (
        req: Override<core.Request, T & { params: P }>,
        res: core.Response
    ): void;
}

type OverridePartial<A, B> = Omit<A, keyof B> & Partial<B>;
type Override<A, B> = Omit<A, keyof B> & B;

interface ParamsDictionary {
    [key: string]: string;
}

export type RouteParameters<Route extends string> = string extends Route ? ParamsDictionary
    : Route extends `${string}(${string}` ? ParamsDictionary // TODO: handling for regex parameters
    : Route extends `${string}:${infer Rest}` ?
            & (
                GetRouteParameter<Rest> extends never ? ParamsDictionary
                    : GetRouteParameter<Rest> extends `${infer ParamName}?` ? { [P in ParamName]?: string }
                    : { [P in GetRouteParameter<Rest>]: string }
            )
            & (Rest extends `${GetRouteParameter<Rest>}${infer Next}` ? RouteParameters<Next> : unknown)
    : {};

type GetRouteParameter<S extends string> = RemoveTail<
    RemoveTail<RemoveTail<S, `/${string}`>, `-${string}`>,
    `.${string}`
>;

type RemoveTail<S extends string, Tail extends string> = S extends `${infer P}${Tail}` ? P : S;
