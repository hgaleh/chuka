import 'reflect-metadata';
import express from 'express';
import { Container, interfaces } from "inversify";
import { Controller, getRouterSymbol, setControllerSymbol } from './controller';
import ws from 'express-ws';

export function createApp(config: ApplicationConfig) {
    const app = express();
    ws(app);

    const controllerEmulator = new ControllerEmulator(app);
    const container = new Container();
    initAllDependencies(config, container);
    initControllers(config.routes, container, controllerEmulator as any as Controller);

    return {
        listen(port: number, callback: any): void {
            app.listen(port, callback);
        }
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

function initControllersAsDependency(routes: Array<Route>, container: Container, parentPath = ''): void {
    for (const route of routes) {
        const key = parentPath + route.path;
        bindClass(container, key, route.controller);
        if (route.children) {
            initControllersAsDependency(route.children, container, key);
        }
    }
}

function bindClass(container: Container, token: string, classtype: Type<any>): void {
    container.bind<any>(token).to(classtype as any as interfaces.Newable<any>);
}

function bindValue(container: Container, token: string, value: any): void {
    container.bind<any>(token).toConstantValue(value);
}

function initControllers(routes: Array<Route>, container: Container, app: Controller, parentPath = ''): void {
    for (const route of routes) {
        const key = parentPath + route.path;
        const controller = container.get<Controller>(key);
        app[setControllerSymbol](route.path, controller);

        if (route.children) {
            initControllers(route.children, container, controller, key);
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
    path: string;
    controller: Type<Controller>;
    children?: Array<Route>;
}

interface ApplicationConfig {
    dependencies?: Array<Dependency>;
    routes: Array<Route>;
}