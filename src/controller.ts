import express from 'express';
import core from 'express-serve-static-core';
import { injectable } from 'inversify';
import ws from 'ws';

export const getRouterSymbol = Symbol();
export const setControllerSymbol = Symbol();

export interface Middleware<T> {
    (req: MergePartial<express.Request, T>, res: express.Response, next: core.NextFunction): void;
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

    protected middlewareWS(): MiniControllerWS<unknown>;
    protected middlewareWS<M0>(middleware0: WSMiddleware<M0>): MiniControllerWS<M0>;
    protected middlewareWS<M0, M1>(middleware0: WSMiddleware<M0>, middleware1: WSMiddleware<M1>): MiniControllerWS<M0 & M1>;
    protected middlewareWS<M0, M1, M2>(middleware0: WSMiddleware<M0>, middleware1: WSMiddleware<M1>, middleware2: WSMiddleware<M2>): MiniControllerWS<M0 & M1 & M2>;
    protected middlewareWS<M0, M1, M2, M3>(middleware0: WSMiddleware<M0>, middleware1: WSMiddleware<M1>, middleware2: WSMiddleware<M2>, middleware3: WSMiddleware<M3>): MiniControllerWS<M0 & M1 & M2 & M3>;
    protected middlewareWS(...middlewares: Array<unknown>): MiniControllerWS<unknown> {
        return (handler) => {
            (this.router as any).ws.apply(this.router, ['/', ...middlewares, handler]);
        }
    }

    protected middleware(): MiniController<unknown>;
    protected middleware<M0>(middleware0: Middleware<M0>): MiniController<M0>;
    protected middleware<M0, M1>(middleware0: Middleware<M0>, middleware1: Middleware<M1>): MiniController<M0 & M1>;
    protected middleware<M0, M1, M2>(middleware0: Middleware<M0>, middleware1: Middleware<M1>, middleware2: Middleware<M2>): MiniController<M0 & M1 & M2>;
    protected middleware<M0, M1, M2, M3>(middleware0: Middleware<M0>, middleware1: Middleware<M1>, middleware2: Middleware<M2>, middleware3: Middleware<M3>): MiniController<M0 & M1 & M2 & M3>;
    protected middleware(...middlewares: Array<unknown>): MiniController<unknown> {    
        return new MiniController(this.router, middlewares);
    }
}

type WSHandler<T> = (ws: ws.WebSocket, req: Merge<express.Request, T>) => void;
export type WSMiddleware<T> = (ws: ws.WebSocket, req: MergePartial<express.Request, T>, next: express.NextFunction) => void

interface MiniControllerWS<T> {
    (handler: WSHandler<T>): void;
}

class MiniController<T> {
    constructor(
        private router: any,
        private middlewares: any[]
    ) {}

    get<Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>): void {
        this.router.get.apply(this.router, [
            path,
            ...this.middlewares,
            (req: any, res: any) => {
                handler(req, res);
            }
        ]);
    }

    post<Path extends string>(path: Path, handler: RequestHandler<T, RouteParameters<Path>>): void {
        this.router.post.apply(this.router, [
            path,
            ...this.middlewares,
            (req: any, res: any) => {
                handler(req, res);
            }
        ]);
    }

    middleware<M0>(middleware0: Middleware<Merge<T, M0>>): MiniController<Merge<T, M0>>;
    middleware<M0, M1>(middleware0: Middleware<Merge<T, M0>>, middleware1: Middleware<Merge<T, M1>>): MiniController<Merge<T, M0 & M1>>;
    middleware<M0, M1, M2>(middleware0: Middleware<Merge<T, M0>>, middleware1: Middleware<Merge<T, M1>>, middleware2: Middleware<Merge<T, M2>>): MiniController<Merge<T, M0 & M1 & M2>>;
    middleware<M0, M1, M2, M3>(middleware0: Middleware<Merge<T, M0>>, middleware1: Middleware<Merge<T, M1>>, middleware2: Middleware<Merge<T, M2>>, middleware3: Middleware<Merge<T, M3>>): MiniController<Merge<T, M0 & M1 & M2 & M3>>;
    middleware<S>(...middlewares: Array<Middleware<S>>): MiniController<S> {    
        return new MiniController(this.router, this.middlewares.concat(middlewares));
    }
}

interface RequestHandler<
    T,
    P = ParamsDictionary
> {
    (
        req: Merge<core.Request, T & { params: P }>,
        res: core.Response
    ): void;
}

export type Merge<A, B> = {
   [k in keyof A & keyof B]: (A & B)[k] extends never ? B[k] : A[k] & B[k]
} & Omit<A, keyof B> & Omit<B, keyof A>;

export type MergePartial<A, B> = {
    [k in keyof A & keyof B]: (A & B)[k] extends never ? B[k] : A[k] & B[k]
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
