import { Middleware } from '@galeh/chuka';

export function createLogger(): Middleware<unknown> {
    return (req, res, next) => {
        console.log('logging a message...');
        next();
    }
}