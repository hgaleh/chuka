import { Middleware } from 'galeh';

export function createLoggerInterceptor(): Middleware<unknown> {
    return (req, res, next) => {
        console.log('logging a message...');
        next();
    }
}