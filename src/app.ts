import 'reflect-metadata';
import express from 'express';
import { Container, interfaces } from "inversify";
import inversify from "inversify";
import { Controller, RequestHandlerParams, getRouterSymbol, setControllerSymbol } from './controller';
import ws from 'express-ws';
import core from 'express-serve-static-core';

export function createApp(config: ApplicationConfig): express.Application {
    const app = express();

    if (config.on) {
        setEventCallbacks(app, config.on);
    }

    if (config.set) {
        applySettings(app, config.set);
    }

    ws(app);

    if (config.middlewares) {
        app.use.apply(app, config.middlewares as any);
    }

    const controllerEmulator = new ControllerEmulator(app);
    const container = new Container();
    initAllDependencies(config, container);
    initControllers(config.routes, container, controllerEmulator as any as Controller);

    return app;
}

function setEventCallbacks(app: express.Application, settings: EventCallback[]): void {
    for (const setting of settings) {
        app.on(setting.event, setting.callback);
    }
}

function applySettings(app: express.Application, settings: Partial<Settings>): void {
    for (const [key, value] of Object.entries(settings)) {
        // @ts-ignore
        app.set(SettingsEnum[key], value);
    }
}

function initAllDependencies(config: ApplicationConfig, container: Container): void {
    if (config.dependencies) {
        initDependencies(config.dependencies, container);
    }

    initControllersAsDependency(config.routes, container);
}

function initDependencies(dependencies: Array<Dependency>, container: Container): void {
    for (const dep of dependencies) {
        if (dep.useValue) {
            bindValue(container, dep.provide, dep.useValue);
            continue;
        }

        if (dep.useClass) {
            bindClass(container, dep.provide, dep.useClass);
            continue;
        }
    }
}

function initControllersAsDependency(routes: Array<Route>, container: Container): void {
    for (const route of routes) {
        bindClass(container, route.controller, route.controller);
        if (route.children) {
            initControllersAsDependency(route.children, container);
        }
    }
}

function bindClass<T>(container: Container, token: Type<T> | string, classtype: Type<any>): void {
    if (!container.isBound(token)){
        container.bind<any>(token).to(classtype as any as interfaces.Newable<any>);
    }
}

function bindValue(container: Container, token: string, value: any): void {
    if (!container.isBound(token)) {
        container.bind<any>(token).toConstantValue(value);
    }
}

function bindFactory(container: Container, token: string, factory: inversify.interfaces.FactoryCreator<unknown>): void {
    if (!container.isBound(token)) {
        container.bind<any>(token).toFactory(factory);
    }
}


function initControllers(routes: Array<Route>, container: Container, app: Controller): void {
    for (const route of routes) {
        const controller = container.get<Controller>(route.controller);
        app[setControllerSymbol](route.path, controller);

        if (route.children) {
            initControllers(route.children, container, controller);
        }
    }
}

class ControllerEmulator {
    constructor(private app: express.Application) {}

    private [setControllerSymbol](path: string, subrouter: Controller): void {
        this.app.use(path, subrouter[getRouterSymbol]());
    }
}

interface Type<T> extends Function {
    new(...args: any[]): T;
}

interface Dependency {
    provide: string;
    useClass?: Type<any>;
    useValue?: any;
}

interface Route {
    path: core.PathParams;
    controller: Type<Controller>;
    children?: Array<Route>;
}

interface ApplicationConfig {
    routes: Array<Route>;
    dependencies?: Array<Dependency>;
    middlewares?: Array<RequestHandlerParams<any>>;
    on?: EventCallback[];
    set?: Partial<Settings>;
}

type EventCallback = {
    event: 'connect' | 'connection' | 'close' | 'error' | 'listening' | 'lookup' | 'ready' | 'timeout' | 'mount';
    callback: (parent: express.Application) => void
};

interface Settings extends Record<SettingsEnumKeys, any>{
    caseSensitiveRouting: boolean;
    env: string;
    etag: any;
    jsonpCallbackName: string;
    jsonEscape: boolean;
    jsonReplacer: any;
    jsonSpaces: any;
    queryParser: any;
    strictRouting: boolean;
    subdomainOffset: number;
    trustProxy: any;
    views: string | string[];
    viewCache: boolean;
    viewEngine: string;
    xPoweredBy: boolean;
}

class SettingsEnum implements Record<SettingsEnumKeys, string>{
    caseSensitiveRouting = 'case sensitive routing';
    env = 'env';
    etag = 'etag';
    jsonpCallbackName = 'jsonp callback name';
    jsonEscape = 'json escape'
    jsonReplacer = 'json replacer';
    jsonSpaces = 'json spaces';
    queryParser = 'query parser';
    strictRouting = 'strict routing';
    subdomainOffset = 'subdomain offset';
    trustProxy = 'trust proxy';
    views = 'views';
    viewCache = 'view cache';
    viewEngine = 'view engine';
    xPoweredBy = 'x-powered-by';
}

type SettingsEnumKeys = 
    'caseSensitiveRouting' |
    'env' |
    'etag' |
    'jsonpCallbackName' |
    'jsonEscape' |
    'jsonReplacer' |
    'jsonSpaces' |
    'queryParser' |
    'strictRouting' |
    'subdomainOffset' |
    'trustProxy' |
    'views' |
    'viewCache' |
    'viewEngine' |
    'xPoweredBy';

