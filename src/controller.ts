import express from 'express';
import core from 'express-serve-static-core';
import { injectable } from 'inversify';
import ws from 'ws';

export const getRouterSymbol = Symbol();
export const setControllerSymbol = Symbol();


export type RequestHandlerParams<T> = Middleware<T> | ErrorHandler<T>;

export interface Middleware<T> {
    (
        req: MergePartial<express.Request, T>,
        res: express.Response,
        next: core.NextFunction
    ): void;
}

export interface ErrorHandler<T> {
    (
        err: any,
        req: MergePartial<express.Request, T>,
        res: express.Response,
        next: express.NextFunction,
    ): void;
}

@injectable()
export class Controller {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
    }

    private [setControllerSymbol](path: core.PathParams, subrouter: Controller): void {
        this.router.use(path, subrouter[getRouterSymbol]());
    }

    private [getRouterSymbol](): express.Router {
        return this.router;
    }

    protected middlewareWS<M0>(): MiniControllerWS<M0>;
    protected middlewareWS<M0>(middleware0: WSMiddleware<M0>): MiniControllerWS<M0>;
    protected middlewareWS<M0, M1>(middleware0: WSMiddleware<M0>, middleware1: WSMiddleware<M1>): MiniControllerWS<M0 & M1>;
    protected middlewareWS<M0, M1, M2>(middleware0: WSMiddleware<M0>, middleware1: WSMiddleware<M1>, middleware2: WSMiddleware<M2>): MiniControllerWS<M0 & M1 & M2>;
    protected middlewareWS<M0, M1, M2, M3>(middleware0: WSMiddleware<M0>, middleware1: WSMiddleware<M1>, middleware2: WSMiddleware<M2>, middleware3: WSMiddleware<M3>): MiniControllerWS<M0 & M1 & M2 & M3>;
    protected middlewareWS(...middlewares: Array<unknown>): MiniControllerWS<unknown> {
        return (handler) => {
            (this.router as any).ws.apply(this.router, ['/', ...middlewares, handler]);
        }
    }

    protected middleware<M0>(): MiniController<M0>;
    protected middleware<M0>(middleware0: RequestHandlerParams<M0>): MiniController<M0>;
    protected middleware<M0, M1>(middleware0: RequestHandlerParams<M0>, middleware1: RequestHandlerParams<M1>): MiniController<M0 & M1>;
    protected middleware<M0, M1, M2>(middleware0: RequestHandlerParams<M0>, middleware1: RequestHandlerParams<M1>, middleware2: RequestHandlerParams<M2>): MiniController<M0 & M1 & M2>;
    protected middleware<M0, M1, M2, M3>(middleware0: RequestHandlerParams<M0>, middleware1: RequestHandlerParams<M1>, middleware2: RequestHandlerParams<M2>, middleware3: RequestHandlerParams<M3>): MiniController<M0 & M1 & M2 & M3>;
    protected middleware(...middlewares: Array<unknown>): MiniController<unknown> {    
        return new MiniController(this.router, middlewares);
    }
}

type WSHandler<T> = (ws: ws.WebSocket, req: Merge<express.Request, T>) => void;
export type WSMiddleware<T> = (ws: ws.WebSocket, req: MergePartial<express.Request, T>, next: express.NextFunction) => void

interface MiniControllerWS<T> {
    (handler: WSHandler<T>): void;
}

interface MiniControllerInterface<T> {
    all: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    get: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    post: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    put: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    delete: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    patch: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    options: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    head: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;

    checkout: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    connect: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    copy: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    lock: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    merge: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    mkactivity: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    mkcol: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    move: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    "m-search": <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    notify: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    propfind: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    proppatch: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    purge: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    report: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    search: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    subscribe: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    trace: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    unlock: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    unsubscribe: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    link: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
    unlink: <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void;
}

class MiniController<T> implements MiniControllerInterface<T> {
    constructor(
        private router: any,
        private middlewares: any[]
    ) { }
    
    all = this.methodImplementation('all').bind(this);
    get = this.methodImplementation('get').bind(this);
    post = this.methodImplementation('post').bind(this);
    put = this.methodImplementation('put').bind(this);
    delete = this.methodImplementation('delete').bind(this);
    patch = this.methodImplementation('patch').bind(this);
    options = this.methodImplementation('options').bind(this);
    head = this.methodImplementation('head').bind(this);
    
    checkout = this.methodImplementation('checkout').bind(this);
    connect = this.methodImplementation('connect').bind(this);
    copy = this.methodImplementation('copy').bind(this);
    lock = this.methodImplementation('lock').bind(this);
    merge = this.methodImplementation('merge').bind(this);
    mkactivity = this.methodImplementation('mkactivity').bind(this);
    mkcol = this.methodImplementation('mkcol').bind(this);
    move = this.methodImplementation('move').bind(this);
    'm-search' = this.methodImplementation('m-search').bind(this);
    notify = this.methodImplementation('notify').bind(this);
    propfind = this.methodImplementation('propfind').bind(this);
    proppatch = this.methodImplementation('proppatch').bind(this);
    purge = this.methodImplementation('purge').bind(this);
    report = this.methodImplementation('report').bind(this);
    search = this.methodImplementation('search').bind(this);
    subscribe = this.methodImplementation('subscribe').bind(this);
    trace = this.methodImplementation('trace').bind(this);
    unlock = this.methodImplementation('unlock').bind(this);
    unsubscribe = this.methodImplementation('unsubscribe').bind(this);
    link = this.methodImplementation('link').bind(this);
    unlink = this.methodImplementation('unlink').bind(this);


    private methodImplementation(methodName: PropertyKey): <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>)=> void {
        return <Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>): void => {
            this.router[methodName].apply(this.router, [
                path,
                ...this.middlewares,
                (req: any, res: any, next: any) => {
                    handler(req, res, next);
                }
            ]);
        }
    }

    middleware<M0>(middleware0: RequestHandlerParams<M0>): MiniController<Merge<T, M0>>;
    middleware<M0, M1>(middleware0: RequestHandlerParams<M0>, middleware1: RequestHandlerParams<M1>): MiniController<Merge<T, M0 & M1>>;
    middleware<M0, M1, M2>(middleware0: RequestHandlerParams<M0>, middleware1: RequestHandlerParams<M1>, middleware2: RequestHandlerParams<M2>): MiniController<Merge<T, M0 & M1 & M2>>;
    middleware<M0, M1, M2, M3>(middleware0: RequestHandlerParams<M0>, middleware1: RequestHandlerParams<M1>, middleware2: RequestHandlerParams<M2>, middleware3: RequestHandlerParams<M3>): MiniController<Merge<T, M0 & M1 & M2 & M3>>;
    middleware<S>(...middlewares: Array<Middleware<S>>): MiniController<S> {    
        return new MiniController(this.router, this.middlewares.concat(middlewares));
    }
}

interface RequestHandler<
    T,
    P = ParamsDictionary
> {
    (
        req: Merge<express.Request, T & { params: P }>,
        res: express.Response,
        next: core.NextFunction
    ): void;
}


export type Merge<A, B> = {
    [k in keyof A & keyof B]: (A & B)[k] extends never ? B[k] : 0 extends 1 & (A & B)[k] ? B[k] : (A & B)[k];
} & Omit<A, keyof B> & Omit<B, keyof A>;
 
export type MergePartial<A, B> = {
    [k in keyof A & keyof B]: (A & B)[k] extends never ? B[k] : 0 extends 1 & (A & B)[k] ? B[k] : (A & B)[k];
} & Omit<A, keyof B> & Partial<Omit<B, keyof A>>;

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
