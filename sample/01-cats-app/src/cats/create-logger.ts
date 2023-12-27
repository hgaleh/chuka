import { Middleware } from 'galeh';

export function createLogger(): Middleware<unknown> {
    return (req, res, next) => {
        console.log('logging a message...');
        next();
    }
}