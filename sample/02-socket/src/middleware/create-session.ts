import session from 'express-session';
import { Middleware } from 'galeh';

export function createSession<T>(options?: session.SessionOptions): Middleware<{ session: T }> {
    const sessiongenerator = session(options);
    return (req, res, next) => {
        sessiongenerator(req as any, res, next);
    }
}
