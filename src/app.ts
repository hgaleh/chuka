import 'reflect-metadata';
import express from 'express';
import { Container, interfaces } from "inversify";
import { Controller, Middleware, getRouterSymbol, setControllerSymbol } from './controller';
import ws from 'express-ws';
import core from 'express-serve-static-core';

export function createApp(config: ApplicationConfig): express.Application {
    const app = express();
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

function initAllDependencies(config: ApplicationConfig, container: Container): void {
    if (config.dependencies) {
        initDependencies(config.dependencies, container);
    }

    initControllersAsDependency(config.routes, container);
}

function initDependencies(dependencies: Array<Dependency>, container: Container): void {
    for (const dep of dependencies) {
        if (dep.useClass && dep.useValue ) {
            throw Error('can not set both value and class');
        }

        if (dep.useValue) {
            bindValue(container, dep.provide, dep.useValue);
        }

        if (dep.useClass) {
            bindClass(container, dep.provide, dep.useClass);
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
    middlewares?: Array<Middleware<any>>
}