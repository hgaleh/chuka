import { NextFunction } from 'express-serve-static-core';
import express from 'express';
import { Merge, Middleware } from '../controller';

export function body<T>(): Middleware<{
    body: T
}> {
    return function <T>(req: Merge<express.Request, T> & Partial<T>, res: express.Response, next: NextFunction): void {
        express.json()(req as any as express.Request, res, next);
    }
}
