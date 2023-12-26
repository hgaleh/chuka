import 'reflect-metadata';
import express from 'express';
import { Container, interfaces } from "inversify";
import { Controller, getRouterSymbol, setControllerSymbol } from './controller';

export function createApp(routes: Array<Route>) {
    const app = express();
    const controllerEmulator = new ControllerEmulator(app);
    const container = new Container();
    initDependencies(routes, container);
    initControllers(routes, container, controllerEmulator as any as Controller<unknown>);

    return {
        listen(port: number, callback: any): void {
            app.listen(port, callback);
        }
    }
}

function initDependencies(routes: Array<Route>, container: Container, parentPath = ''): void {
    for (const route of routes) {
        const key = parentPath + route.path;
        container.bind<any>(key).to(route.controller as any as interfaces.Newable<any>);
        if (route.dependencies) {
            for(const dep of route.dependencies) {
                container.bind<any>(dep.provide).to(dep.useClass as any as interfaces.Newable<any>);
            }
        }
        if (route.children) {
            initDependencies(route.children, container, key);
        }
    }
}

function initControllers(routes: Array<Route>, container: Container, app: Controller<unknown>, parentPath = ''): void {
    for (const route of routes) {
        const key = parentPath + route.path;
        const controller = container.get<Controller<unknown>>(key);
        app[setControllerSymbol](route.path, controller);

        if (route.children) {
            initControllers(route.children, container, controller, key);
        }
    }
}

class ControllerEmulator {
    constructor(private app: express.Application) {}

    private [setControllerSymbol](path: string, subrouter: Controller<unknown>): void {
        this.app.use(path, subrouter[getRouterSymbol]());
    }
}

export interface Type<T> extends Function {
    new(...args: any[]): T;
}

interface Dependency {
    provide: string;
    useClass: Type<any>
}

export interface Route {
    path: string;
    controller: Type<Controller<unknown>>;
    children?: Array<Route>;
    dependencies?: Array<Dependency>
}
