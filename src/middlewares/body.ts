import { NextFunction } from 'express-serve-static-core';
import { IncomingMessage, ServerResponse } from 'http';
import { json } from 'express';
import { Middleware } from '../controller';

export function body<T>(): Middleware<{
    body: T
}> {
    return function <T>(req: Omit<IncomingMessage, keyof T> & Partial<T>, res: ServerResponse<IncomingMessage>, next: NextFunction): void {
        json()(req as any as IncomingMessage, res, next);
    }
}
