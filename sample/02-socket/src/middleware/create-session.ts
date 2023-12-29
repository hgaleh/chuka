import session from 'express-session';
import { Middleware, OverridePartial } from 'galeh';

export function createSession<T>(options?: session.SessionOptions): Middleware<{ session: OverridePartial<session.Session, T> }> {
    const sessiongenerator = session(options);
    return (req, res, next) => {
        sessiongenerator(req as any, res, next);
    }
}
