import express from 'express';
import core from 'express-serve-static-core';
import { injectable } from 'inversify';

export const getRouterSymbol = Symbol();
export const setControllerSymbol = Symbol();

export interface Middleware<T> {
    (req: OverridePartial<express.Request, T>, res: express.Response, next: core.NextFunction): void;
}

@injectable()
export class Controller {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
    }

    private [setControllerSymbol](path: string, subrouter: Controller): void {
        this.router.use(path, subrouter[getRouterSymbol]());
    }

    private [getRouterSymbol](): express.Router {
        return this.router;
    }

    protected middleware<M0>(): MiniController<any>;
    protected middleware<M0>(middleware0: Middleware<M0>): MiniController<M0>;
    protected middleware<M0, M1>(middleware0: Middleware<M0>, middleware1: Middleware<M1>): MiniController<M0 & M1>;
    protected middleware<M0, M1, M2>(middleware0: Middleware<M0>, middleware1: Middleware<M1>, middleware2: Middleware<M2>): MiniController<M0 & M1 & M2>;
    protected middleware<M0, M1, M2, M3>(middleware0: Middleware<M0>, middleware1: Middleware<M1>, middleware2: Middleware<M2>, middleware3: Middleware<M3>): MiniController<M0 & M1 & M2 & M3>;
    protected middleware<S>(...middlewares: Array<Middleware<S>>): MiniController<S> {    
        return new MiniController(this.router, middlewares);
    }
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

    middleware<M0>(middleware0: Middleware<M0>): MiniController<M0>;
    middleware<M0, M1>(middleware0: Middleware<M0>, middleware1: Middleware<M1>): MiniController<M0 & M1>;
    middleware<M0, M1, M2>(middleware0: Middleware<M0>, middleware1: Middleware<M1>, middleware2: Middleware<M2>): MiniController<M0 & M1 & M2>;
    middleware<M0, M1, M2, M3>(middleware0: Middleware<M0>, middleware1: Middleware<M1>, middleware2: Middleware<M2>, middleware3: Middleware<M3>): MiniController<M0 & M1 & M2 & M3>;
    middleware<S>(...middlewares: Array<Middleware<S>>): MiniController<S> {    
        return new MiniController(this.router, this.middlewares.concat(middlewares));
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
